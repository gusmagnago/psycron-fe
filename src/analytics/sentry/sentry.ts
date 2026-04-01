import { PSYCRON_BASE_API } from '@psycron/utils/variables';
import * as Sentry from '@sentry/react';

type RuntimeEnv = 'dev' | 'staging' | 'prod';
type SentryEnv = 'development' | 'staging' | 'production';

type AppArea = 'therapist' | 'backoffice' | 'public';
type ActorRole = 'therapist' | 'worker';

type SentryActorContext = {
	area: AppArea;
	role?: ActorRole;
};

type SentryConfig = {
	dsn?: string;
	environment: SentryEnv;
	isDevelopment: boolean;
	isProduction: boolean;
	release: string;
	tracePropagationTargets: string[];
	tracesSampleRate: number;
};

const DEFAULT_RELEASE = 'dev';
const DEFAULT_RUNTIME_ENV: RuntimeEnv = 'dev';
const PROD_TRACE_SAMPLE_RATE = 0.2;
const NON_PROD_TRACE_SAMPLE_RATE = 0.05;

const parseRuntimeEnv = (rawEnv: string | undefined): RuntimeEnv => {
	if (rawEnv === 'prod' || rawEnv === 'staging' || rawEnv === 'dev') {
		return rawEnv;
	}
	return DEFAULT_RUNTIME_ENV;
};

const mapToSentryEnv = (runtimeEnv: RuntimeEnv): SentryEnv => {
	if (runtimeEnv === 'prod') return 'production';
	if (runtimeEnv === 'staging') return 'staging';
	return 'development';
};

const resolveApiOrigin = (baseApi: string): string => {
	try {
		return new URL(baseApi).origin;
	} catch {
		return baseApi;
	}
};

const scrubUrl = (url: string): string => {
	const idx = url.indexOf('?');
	return idx === -1 ? url : url.slice(0, idx);
};

const buildConfig = (): SentryConfig => {
	const runtimeEnv = parseRuntimeEnv(import.meta.env.VITE_RUNTIME_ENV);
	const environment = mapToSentryEnv(runtimeEnv);
	const isProduction = environment === 'production';
	const isDevelopment = environment === 'development';
	const release =
		(import.meta.env.VITE_APP_VERSION as string | undefined) ?? DEFAULT_RELEASE;

	const apiOrigin = resolveApiOrigin(PSYCRON_BASE_API);

	return {
		dsn: import.meta.env.VITE_SENTRY_DSN as string | undefined,
		environment,
		isDevelopment,
		isProduction,
		release: `psycron-fe@${release}`,
		tracesSampleRate: isProduction
			? PROD_TRACE_SAMPLE_RATE
			: NON_PROD_TRACE_SAMPLE_RATE,
		tracePropagationTargets: ['localhost', apiOrigin],
	};
};

const sanitizeEvent = (event: Sentry.ErrorEvent): Sentry.ErrorEvent => {
	if (event.request?.url) {
		event.request.url = scrubUrl(event.request.url);
	}

	if (event.request?.headers) {
		const headers = event.request.headers as Record<string, unknown>;
		delete headers.cookie;
		delete headers.authorization;
	}

	if (event.user) {
		const { id } = event.user;
		event.user = id ? { id } : undefined;
	}

	return event;
};

export const initSentry = (): void => {
	const config = buildConfig();

	if (!config.dsn) {
		if (!config.isProduction) {
			// eslint-disable-next-line no-console
			console.warn('[Sentry] Missing VITE_SENTRY_DSN');
		}
		return;
	}

	Sentry.init({
		dsn: config.dsn,
		environment: config.environment,
		release: config.release,
		enabled: !config.isDevelopment,
		sendDefaultPii: false,
		tracesSampleRate: config.tracesSampleRate,
		tracePropagationTargets: config.tracePropagationTargets,
		beforeSend: sanitizeEvent,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
		integrations: [
			Sentry.replayIntegration(),
			Sentry.browserTracingIntegration(),
			Sentry.feedbackIntegration({
				autoInject: true,
				showBranding: false,
				colorScheme: 'system',
				triggerLabel: 'Report a Bug',
				formTitle: 'Report a Bug',
				nameLabel: 'Name',
				namePlaceholder: 'Your name',
				emailLabel: 'Email',
				emailPlaceholder: 'your@email.com',
				messageLabel: 'What happened?',
				messagePlaceholder:
					'Describe what you were doing and what went wrong.',
				submitButtonLabel: 'Send Report',
				cancelButtonLabel: 'Cancel',
				successMessageText: 'Thank you! Your report has been sent.',
			}),
		],
	});
};

export const setSentryUser = (
	userId: string,
	context: SentryActorContext
): void => {
	Sentry.setUser({ id: userId });
	Sentry.setTag('app_area', context.area);

	if (context.role) {
		Sentry.setTag('actor_role', context.role);
	}
};

export const setSentryArea = (area: AppArea): void => {
	Sentry.setTag('app_area', area);
};

export const clearSentryUser = (): void => {
	Sentry.setUser(null);
	Sentry.setTag('actor_role', '');
	Sentry.setTag('app_area', 'public');
};
