import {
	clearAuthTokens,
	getAccessToken,
	getRefreshToken,
	setTokensKeepingAuthPersistence,
} from '@psycron/context/user/auth/utils/tokenStorage';
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

		// 401 -> attempt refresh once
		if (statusCode === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const storedRefreshToken = getRefreshToken();

				if (!storedRefreshToken) {
					clearAuthTokens();
					return Promise.reject(
						createSanitizedError('Session expired', 401, requestUrl)
					);
				}

				const { accessToken, refreshToken } =
					await refreshTokenService(storedRefreshToken);

				// Keep the same storage kind the user originally chose
				setTokensKeepingAuthPersistence({ accessToken, refreshToken });

				// Update headers and retry
				apiClient.defaults.headers.common['Authorization'] =
					`Bearer ${accessToken}`;
				originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);

				return apiClient(originalRequest);
			} catch {
				clearAuthTokens();
				window.location.href = '/en/sign-in';
				return Promise.reject(
					createSanitizedError('Session expired', 401, requestUrl)
				);
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
