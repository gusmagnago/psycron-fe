import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material';
import { PostHogProvider } from '@posthog/react';
import * as Sentry from '@sentry/react';
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import posthog from 'posthog-js';

import '@psycron/index.css';

import { initPostHog } from './analytics/posthog/config';
import { initSentry } from './analytics/sentry/sentry';
import { RootErrorFallback } from './pages/error/something-went-wrong/RootErrorFallback';
import { validateEnv } from './utils/env/validateEnv';
import App from './App';
import i18n from './i18n';
import theme from './theme';

const envValidation = validateEnv();

if (!envValidation.isValid) {
	if (import.meta.env.PROD) {
		document.getElementById('root')!.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: Inter, sans-serif;
        background: #F7FAFA;
        color: #060B0E;
        padding: 20px;
        text-align: center;
      ">
        <h1 style="color: #FF5450; margin-bottom: 16px;">Configuration Error</h1>
        <p style="max-width: 500px; color: rgba(6, 11, 14, 0.6);">
          The application is misconfigured. Please contact support or check the deployment configuration.
        </p>
      </div>
    `;
		throw new Error(
			`Environment validation failed: ${envValidation.errors.join(', ')}`
		);
	}

	// eslint-disable-next-line no-console
	console.error(
		'[STARTUP] Environment validation failed. Some features may not work correctly.'
	);
}

const isHttpError = (err: unknown): err is { statusCode: number } => {
	if (!err || typeof err !== 'object') return false;
	return (
		'statusCode' in err &&
		typeof (err as { statusCode: unknown }).statusCode === 'number'
	);
};

const reportQueryError = (err: unknown): void => {
	if (!shouldSendToSentry(err)) return;
	Sentry.captureException(err);
	posthog.captureException(err instanceof Error ? err : new Error(String(err)));
};

const shouldSendToSentry = (err: unknown): boolean => {
	if (!(err instanceof Error) && !isHttpError(err)) return true;
	if (isHttpError(err)) {
		const sc = err.statusCode;

		if (sc >= 400 && sc < 500 && sc !== 429) return false;
		if (sc === 429) return true;
		if (sc >= 500) return true;
	}
	return true;
};

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			reportQueryError(error);
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			reportQueryError(error);
		},
	}),
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

initSentry();
initPostHog();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Sentry.ErrorBoundary fallback={<RootErrorFallback />}>
			<PostHogProvider client={posthog}>
				<QueryClientProvider client={queryClient}>
					<I18nextProvider i18n={i18n}>
						<ThemeProvider theme={theme}>
							<App />
						</ThemeProvider>
					</I18nextProvider>
				</QueryClientProvider>
			</PostHogProvider>
		</Sentry.ErrorBoundary>
	</React.StrictMode>
);
