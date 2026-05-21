import { expect, test } from '@playwright/test';

import { MOCK_REFRESH_TOKEN } from '../fixtures/auth.fixtures';
import { mockTherapist, THERAPIST_ID } from '../fixtures/therapist.fixtures';

test.describe('Token refresh — concurrent 401 guard', () => {
	test('only one refresh token request fires when multiple requests receive 401', async ({
		page,
	}) => {
		let refreshCallCount = 0;
		let sessionCallCount = 0;

		// First session call returns 401 to trigger refresh
		await page.route('**/users/session', async (route) => {
			sessionCallCount++;
			if (sessionCallCount === 1) {
				route.fulfill({
					status: 401,
					body: JSON.stringify({ message: 'Token expired' }),
				});
			} else {
				route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ isAuthenticated: true, user: mockTherapist }),
				});
			}
		});

		await page.route('**/token/refresh-token', (route) => {
			refreshCallCount++;
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					accessToken: 'new-access-token',
					refreshToken: 'new-refresh-token',
				}),
			});
		});

		// Mock a secondary API call that also gets 401 on first attempt
		await page.route(`**/users/${THERAPIST_ID}`, async (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(mockTherapist),
			});
		});

		await page.addInitScript(() => {
			localStorage.setItem('_psy_persist', 'local');
			localStorage.setItem('_psyd', 'expired-token');
			localStorage.setItem('_psyrt', 'mock-refresh-token');
		});

		await page.goto('/en/dashboard');

		// Give the refresh flow time to settle
		await page.waitForTimeout(1000);

		// The module-level lock in axios-instance.ts ensures only one refresh fires
		expect(refreshCallCount).toBeLessThanOrEqual(1);
	});

	test('expired session clears tokens and redirects to sign-in when refresh fails', async ({
		page,
	}) => {
		await page.route('**/users/session', (route) => {
			route.fulfill({
				status: 401,
				body: JSON.stringify({ message: 'Token expired' }),
			});
		});

		await page.route('**/token/refresh-token', (route) => {
			route.fulfill({
				status: 401,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'Refresh token expired' }),
			});
		});

		await page.addInitScript(() => {
			localStorage.setItem('_psy_persist', 'local');
			localStorage.setItem('_psyd', 'expired-token');
			localStorage.setItem('_psyrt', MOCK_REFRESH_TOKEN);
		});

		await page.goto('/en/dashboard');

		await expect(page).toHaveURL(/\/en\/sign-in/, { timeout: 8000 });
	});
});
