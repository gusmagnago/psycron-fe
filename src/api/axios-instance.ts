import {
	clearAuthTokens,
	getAccessToken,
	getRefreshToken,
	setTokensKeepingAuthPersistence,
} from '@psycron/context/user/auth/utils/tokenStorage';
import { SIGNIN } from '@psycron/pages/urls';
import { PSYCRON_BASE_API } from '@psycron/utils/variables';
import type {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

import { sanitizeAuthError } from './auth/auth-errors';
import { refreshTokenService } from './auth';
import { CustomError } from './error';

type ApiErrorPayload = {
	message?: string;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
	_retry?: boolean;
};

// Module-level lock: prevents multiple concurrent 401s from each triggering a
// separate token refresh. All queued requests retry once the single refresh resolves.
let isRefreshing = false;
let failedQueue: Array<{
	reject: (error: unknown) => void;
	resolve: (token: string) => void;
}> = [];

const flushQueue = (error: unknown, token: string | null = null): void => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token!);
		}
	});
	failedQueue = [];
};

const getLocaleFromPath = (): string => {
	const [, locale] = window.location.pathname.split('/');
	return locale && locale.length === 2 ? locale : 'en';
};

const apiClient: AxiosInstance = axios.create({
	baseURL: PSYCRON_BASE_API as string,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

const createSanitizedError = (
	message: string,
	statusCode: number,
	requestUrl: string
): CustomError => {
	const rawError = new CustomError(message, statusCode);
	return sanitizeAuthError(rawError, requestUrl);
};

apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = getAccessToken();

		if (token) {
			// InternalAxiosRequestConfig.headers is AxiosHeaders in newer axios versions
			config.headers.set('Authorization', `Bearer ${token}`);
		}

		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<ApiErrorPayload>) => {
		const originalRequest = error.config as RetryableRequestConfig | undefined;
		const statusCode = error.response?.status ?? 500;
		const requestUrl = originalRequest?.url ?? '';

		// 401 -> attempt refresh. A module-level lock ensures only one refresh fires
		// even when multiple concurrent requests all receive 401 simultaneously.
		if (statusCode === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				// Another refresh is already in flight — queue this request and wait.
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then((token) => {
					originalRequest.headers.set('Authorization', `Bearer ${token}`);
					return apiClient(originalRequest);
				});
			}

			isRefreshing = true;

			try {
				const storedRefreshToken = getRefreshToken();

				if (!storedRefreshToken) {
					clearAuthTokens();
					flushQueue(new Error('No refresh token'), null);
					return Promise.reject(
						createSanitizedError('Session expired', 401, requestUrl)
					);
				}

				const { accessToken, refreshToken } =
					await refreshTokenService(storedRefreshToken);

				setTokensKeepingAuthPersistence({ accessToken, refreshToken });

				apiClient.defaults.headers.common['Authorization'] =
					`Bearer ${accessToken}`;
				originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);

				flushQueue(null, accessToken);

				return apiClient(originalRequest);
			} catch (refreshError) {
				flushQueue(refreshError, null);
				clearAuthTokens();
				window.location.href = `/${getLocaleFromPath()}/${SIGNIN}`;
				return Promise.reject(
					createSanitizedError('Session expired', 401, requestUrl)
				);
			} finally {
				isRefreshing = false;
			}
		}

		// 429 rate limit
		if (statusCode === 429) {
			const retryAfterHeader = error.response?.headers?.['retry-after'];
			const rateLimitError = createSanitizedError(
				'Rate limited',
				429,
				requestUrl
			);

			if (typeof retryAfterHeader === 'string') {
				const parsed = Number.parseInt(retryAfterHeader, 10);
				if (!Number.isNaN(parsed)) {
					(rateLimitError as CustomError & { retryAfter: number }).retryAfter =
						parsed;
				}
			}

			return Promise.reject(rateLimitError);
		}

		const message = error.response?.data?.message ?? 'Unknown error occurred';

		return Promise.reject(
			createSanitizedError(message, statusCode, requestUrl)
		);
	}
);

export default apiClient;
