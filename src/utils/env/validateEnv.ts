/**
 * Environment Variable Validation
 *
 * Validates required environment variables at application startup.
 * Catches misconfigurations early before they cause runtime errors.
 *
 * @module utils/env/validateEnv
 */

export interface EnvConfig {
	VITE_ASSETS_CDN_URL: string;
	VITE_PSYCRON_BASE_API_URL: string;
}

interface ValidationResult {
	errors: string[];
	isValid: boolean;
	warnings: string[];
}

/**
 * List of environment variables that should NEVER be in frontend code.
 * If detected, the application will refuse to start.
 */
const FORBIDDEN_ENV_VARS = [
	'VITE_JWT_SECRET',
	'VITE_DB_PASSWORD',
	'VITE_DB_CONNECTION_STRING',
	'VITE_PRIVATE_KEY',
	'VITE_SECRET_KEY',
	'VITE_API_SECRET',
	'VITE_ENCRYPTION_KEY',
] as const;

/**
 * Required environment variables that must be set for the app to function.
 */
const REQUIRED_ENV_VARS = ['VITE_PSYCRON_BASE_API_URL'] as const;

/**
 * Optional environment variables with feature descriptions.
 */
const OPTIONAL_ENV_VARS: Record<string, string> = {
	VITE_APP_VERSION: 'Sentry release version tagging',
	VITE_ASSETS_CDN_URL: 'Asset CDN host',
	VITE_ENABLE_SUBSCRIPTION_MOCK: 'Subscription mock mode for development/testing',
	VITE_FEATURE_SUBSCRIPTION_TIER_TOGGLE:
		'Feature flag for subscription tier toggle UI',
	VITE_GOOGLE_MAPS_API_KEY: 'Google Maps features',
	VITE_IP_GEO_KEY: 'IP geolocation lookup',
	VITE_POSTHOG_HOST: 'PostHog API host',
	VITE_POSTHOG_KEY: 'PostHog analytics ingestion',
	VITE_PSYCRON_BASE_URL: 'Test-area redirect host',
	VITE_SENTRY_DSN: 'Sentry error tracking',
	VITE_TEST_MODE: 'Optional testing mode override',
};

const VALID_RUNTIME_ENVS = ['dev', 'prod'] as const;
const VALID_TEST_MODE_VALUES = ['true', 'false', '1', '0', 'test', 'app'] as const;

const DEPRECATED_ENV_ALIASES = [
	{
		deprecated: 'VITE_PUBLIC_POSTHOG_KEY',
		replacement: 'VITE_POSTHOG_KEY',
	},
	{
		deprecated: 'VITE_PUBLIC_POSTHOG_HOST',
		replacement: 'VITE_POSTHOG_HOST',
	},
] as const;

/**
 * Validates a URL format
 */
const isValidUrl = (url: string): boolean => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

/**
 * Checks if a value looks like a placeholder that wasn't replaced
 */
const isPlaceholder = (value: string): boolean => {
	const placeholderPatterns = [
		/^your_.*_here$/i,
		/^xxx+$/i,
		/^placeholder$/i,
		/^changeme$/i,
		/^todo$/i,
		/^<.*>$/,
		/^\[.*\]$/,
		/^\{.*\}$/,
	];
	return placeholderPatterns.some((pattern) => pattern.test(value));
};

/**
 * Validates all environment variables at startup.
 * Call this function in main.tsx before rendering the app.
 *
 * @throws {Error} If critical validation fails in production
 * @returns {ValidationResult} Validation results with errors and warnings
 */
export const validateEnv = (): ValidationResult => {
	const errors: string[] = [];
	const warnings: string[] = [];
	const isDev = import.meta.env.DEV;
	const mode = import.meta.env.MODE;

	// eslint-disable-next-line no-console
	console.info(`[ENV] Validating environment (mode: ${mode})`);

	// Check for forbidden secrets
	for (const forbidden of FORBIDDEN_ENV_VARS) {
		const value = import.meta.env[forbidden];
		if (value !== undefined && value !== '') {
			errors.push(
				`SECURITY VIOLATION: ${forbidden} should NEVER be in frontend code. ` +
					'This is a backend-only secret. Remove it from your .env file immediately.'
			);
		}
	}

	// Check required variables
	for (const required of REQUIRED_ENV_VARS) {
		const value = import.meta.env[required];
		if (!value) {
			errors.push(`Missing required environment variable: ${required}`);
		} else if (isPlaceholder(value)) {
			errors.push(
				`${required} contains a placeholder value. Please set a real value.`
			);
		}
	}

	// Validate API URL format
	const apiUrl = import.meta.env.VITE_PSYCRON_BASE_API_URL;
	if (apiUrl && !isValidUrl(apiUrl)) {
		errors.push(
			`VITE_PSYCRON_BASE_API_URL is not a valid URL: "${apiUrl}". ` +
				'Expected format: http(s)://domain/path'
		);
	}

	// Check for HTTP in production (should be HTTPS)
	if (!isDev && apiUrl && apiUrl.startsWith('http://')) {
		warnings.push(
			'VITE_PSYCRON_BASE_API_URL uses HTTP in production. Consider using HTTPS for security.'
		);
	}

	// Validate runtime env
	const runtimeEnv = (import.meta.env.VITE_RUNTIME_ENV as string | undefined)?.trim();
	if (!runtimeEnv) {
		errors.push('Missing required environment variable: VITE_RUNTIME_ENV');
	} else if (
		!VALID_RUNTIME_ENVS.includes(
			runtimeEnv as (typeof VALID_RUNTIME_ENVS)[number]
		)
	) {
		errors.push(
			`VITE_RUNTIME_ENV must be one of: ${VALID_RUNTIME_ENVS.join(', ')}`
		);
	}

	// Validate test-mode override
	const testModeRaw = (import.meta.env.VITE_TEST_MODE as string | undefined)?.trim();
	const testModeNormalized = testModeRaw?.toLowerCase();
	if (
		testModeRaw &&
		!VALID_TEST_MODE_VALUES.includes(
			testModeNormalized as (typeof VALID_TEST_MODE_VALUES)[number]
		)
	) {
		errors.push(
			`VITE_TEST_MODE must be one of: ${VALID_TEST_MODE_VALUES.join(', ')}`
		);
	}

	if (
		!isDev &&
		testModeNormalized &&
		['true', '1', 'test'].includes(testModeNormalized)
	) {
		warnings.push(
			'VITE_TEST_MODE is forcing testing behavior in production mode. Ensure this is intentional.'
		);
	}

	// Validate optional URL-like vars when present
	const assetsCdnUrl = import.meta.env.VITE_ASSETS_CDN_URL;
	if (assetsCdnUrl && !isValidUrl(assetsCdnUrl)) {
		errors.push(
			`VITE_ASSETS_CDN_URL is not a valid URL: "${assetsCdnUrl}". ` +
				'Expected format: http(s)://domain/path'
		);
	}

	const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
	if (posthogHost && !isValidUrl(posthogHost)) {
		errors.push(
			`VITE_POSTHOG_HOST is not a valid URL: "${posthogHost}". ` +
				'Expected format: http(s)://domain'
		);
	}

	const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
	if (sentryDsn && !isValidUrl(sentryDsn)) {
		errors.push(
			`VITE_SENTRY_DSN is not a valid URL: "${sentryDsn}". ` +
				'Expected format: https://<key>@<host>/<project-id>'
		);
	}

	// VITE_PSYCRON_BASE_URL should be a host (without protocol) because we prepend protocol at runtime.
	const psycronBaseUrl = (
		import.meta.env.VITE_PSYCRON_BASE_URL as string | undefined
	)?.trim();
	if (psycronBaseUrl && /^https?:\/\//i.test(psycronBaseUrl)) {
		errors.push(
			`VITE_PSYCRON_BASE_URL must be a host without protocol. Current value: "${psycronBaseUrl}"`
		);
	}

	// Validate boolean-ish flags when present
	for (const [varName, value] of [
		[
			'VITE_ENABLE_SUBSCRIPTION_MOCK',
			import.meta.env.VITE_ENABLE_SUBSCRIPTION_MOCK as string | undefined,
		],
		[
			'VITE_FEATURE_SUBSCRIPTION_TIER_TOGGLE',
			import.meta.env.VITE_FEATURE_SUBSCRIPTION_TIER_TOGGLE as
				| string
				| undefined,
		],
	] as const) {
		if (!value) continue;
		const normalized = value.trim().toLowerCase();
		if (normalized !== 'true' && normalized !== 'false') {
			errors.push(`${varName} must be "true" or "false"`);
		}
	}

	// Deprecated variable aliases (still found in some environments)
	for (const alias of DEPRECATED_ENV_ALIASES) {
		const deprecatedValue = import.meta.env[alias.deprecated];
		const replacementValue = import.meta.env[alias.replacement];
		if (deprecatedValue) {
			warnings.push(
				`${alias.deprecated} is deprecated. Use ${alias.replacement} instead.`
			);
		}
		if (deprecatedValue && !replacementValue) {
			warnings.push(
				`${alias.replacement} is missing while ${alias.deprecated} is set. ${alias.replacement} is the variable used by the app.`
			);
		}
	}

	// Check optional variables and warn if missing
	for (const [varName, description] of Object.entries(OPTIONAL_ENV_VARS)) {
		const value = import.meta.env[varName];
		if (!value || isPlaceholder(value)) {
			warnings.push(
				`Optional: ${varName} not configured. Feature disabled: ${description}`
			);
		}
	}

	// Check for localhost in production
	if (!isDev && apiUrl && apiUrl.includes('localhost')) {
		errors.push(
			'VITE_PSYCRON_BASE_API_URL points to localhost in production mode. ' +
				'This is likely a misconfiguration.'
		);
	}

	// Log results
	/* eslint-disable no-console */
	if (errors.length > 0) {
		console.error('[ENV] Validation FAILED:');
		errors.forEach((err) => console.error(`  - ${err}`));
	}

	if (warnings.length > 0) {
		console.warn('[ENV] Validation warnings:');
		warnings.forEach((warn) => console.warn(`  - ${warn}`));
	}
	/* eslint-enable no-console */

	if (errors.length === 0) {
		// eslint-disable-next-line no-console
		console.info('[ENV] Validation passed');
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
};

/**
 * Gets the validated environment configuration.
 * Only call this after validateEnv() has passed.
 */
export const getEnvConfig = (): EnvConfig => {
	return {
		VITE_PSYCRON_BASE_API_URL: import.meta.env.VITE_PSYCRON_BASE_API_URL,
		VITE_ASSETS_CDN_URL: import.meta.env.VITE_ASSETS_CDN_URL,
	};
};

export default validateEnv;
