import type { Page } from '@playwright/test';

import { mockTherapist } from './therapist.fixtures';

// Actual localStorage key constants (from src/utils/tokens/index.ts)
const ID_TOKEN = '_psyd';
const REFRESH_TOKEN = '_psyrt';
const STORAGE_KIND_KEY = '_psy_persist';

export const MOCK_ACCESS_TOKEN = 'mock-access-token';
export const MOCK_REFRESH_TOKEN = 'mock-refresh-token';

/**
 * Injects a fake authenticated session into localStorage before the page loads
 * and mocks the /users/session endpoint to return an authenticated therapist.
 *
 * Call this in test.beforeEach to bypass the auth redirect on private routes.
 */
export const setupAuthenticatedSession = async (page: Page): Promise<void> => {
	await page.addInitScript(
		({ idToken, refreshToken, storageKindKey, accessToken, refreshTkn }) => {
			localStorage.setItem(storageKindKey, 'local');
			localStorage.setItem(idToken, accessToken);
			localStorage.setItem(refreshToken, refreshTkn);
		},
		{
			idToken: ID_TOKEN,
			refreshToken: REFRESH_TOKEN,
			storageKindKey: STORAGE_KIND_KEY,
			accessToken: MOCK_ACCESS_TOKEN,
			refreshTkn: MOCK_REFRESH_TOKEN,
		}
	);

	await page.route('**/users/session', (route) => {
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				isAuthenticated: true,
				user: mockTherapist,
			}),
		});
	});
};

/**
 * Clears all auth tokens from localStorage — simulates a logged-out state.
 */
export const clearAuthSession = async (page: Page): Promise<void> => {
	await page.addInitScript(
		({ idToken, refreshToken, storageKindKey }) => {
			localStorage.removeItem(storageKindKey);
			localStorage.removeItem(idToken);
			localStorage.removeItem(refreshToken);
		},
		{
			idToken: ID_TOKEN,
			refreshToken: REFRESH_TOKEN,
			storageKindKey: STORAGE_KIND_KEY,
		}
	);
};
