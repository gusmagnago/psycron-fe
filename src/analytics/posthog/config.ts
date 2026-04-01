/* eslint-disable no-console */
import posthog, { type PostHogConfig } from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST =
	(import.meta.env.VITE_POSTHOG_HOST as string | undefined) ??
	'https://eu.posthog.com';

type RuntimeEnv = 'dev' | 'staging' | 'prod';
type AppEnv = 'development' | 'staging' | 'production';

const parseRuntimeEnv = (rawEnv: string | undefined): RuntimeEnv => {
	if (rawEnv === 'prod' || rawEnv === 'staging' || rawEnv === 'dev') {
		return rawEnv;
	}
	return 'dev';
};

const mapToAppEnv = (runtimeEnv: RuntimeEnv): AppEnv => {
	if (runtimeEnv === 'prod') return 'production';
	if (runtimeEnv === 'staging') return 'staging';
	return 'development';
};

const APP_ENV = mapToAppEnv(parseRuntimeEnv(import.meta.env.VITE_RUNTIME_ENV));

let isInitialized = false;

export const initPostHog = (): void => {
	if (isInitialized) return;
	if (!POSTHOG_KEY) {
		if (APP_ENV !== 'production') {
			console.warn('[PostHog] Missing VITE_POSTHOG_KEY');
		}
		return;
	}

	const config: Partial<PostHogConfig> = {
		api_host: POSTHOG_HOST,

		// ✅ Autocapture enabled (can disable if you want full manual control)
		autocapture: true,

		// ✅ Capture pageviews manually (you already do this in AppAnalytics)
		capture_pageview: false,

		// ✅ Session recording (can toggle per env)
		session_recording: {
			maskAllInputs: true,
			maskInputOptions: {
				password: true,
			},
			recordHeaders: false,
			recordBody: false,
			networkRecordOptions: {
				recordHeaders: false,
				recordBody: false,
				recordInitiatorType: true,
			},
		},

		// ✅ Performance & UX metrics
		capture_performance: true,

		// ✅ Disable in development if desired
		disable_session_recording: APP_ENV === 'development' ? true : false,
	};

	posthog.init(POSTHOG_KEY, config);

	isInitialized = true;
};

export const resetPostHog = (): void => {
	posthog.reset();
};
