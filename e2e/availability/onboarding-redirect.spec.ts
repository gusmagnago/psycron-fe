import { expect, test } from '@playwright/test';

import { setupAuthenticatedSession } from '../fixtures/auth.fixtures';
import { mockAvailability } from '../fixtures/therapist.fixtures';

// PR-346: a new user (no availability yet) must be redirected from the
// dashboard to /availability/generate by AvailabilityGate, without the
// dashboard ever becoming the resting route (the "flash"). A user who already
// has availability must stay on the dashboard.

const DASHBOARD_URL = '/en/dashboard';

test.describe('Onboarding redirect — AvailabilityGate (PR-346)', () => {
	test.beforeEach(async ({ page }) => {
		await setupAuthenticatedSession(page);
		// Make sure no stale draft pushes us to /generate for the wrong reason
		// (STORAGE_KEY in useJupiterFlow.ts).
		await page.addInitScript(() => {
			localStorage.removeItem('_psy_jd');
		});
	});

	test('redirects a user with no availability to /availability/generate', async ({
		page,
	}) => {
		// getAvailability() returns null on a non-2xx response → "no availability".
		await page.route('**/jupiter/availability**', (route) => {
			route.fulfill({ status: 404, body: 'Not Found' });
		});

		await page.goto(DASHBOARD_URL);

		await expect(page).toHaveURL(/\/availability\/generate/, { timeout: 5000 });
	});

	test('keeps a user with availability on the dashboard (no redirect)', async ({
		page,
	}) => {
		await page.route('**/jupiter/availability**', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(mockAvailability),
			});
		});

		await page.goto(DASHBOARD_URL);

		// Give the gate time to (not) redirect, then assert we are still on the
		// dashboard and were never bounced to /generate.
		await page.waitForTimeout(1500);
		await expect(page).toHaveURL(/\/dashboard/);
		await expect(page).not.toHaveURL(/\/availability\/generate/);
	});
});
