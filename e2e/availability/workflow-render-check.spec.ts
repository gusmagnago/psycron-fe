import { expect, test } from '@playwright/test';

import { setupAuthenticatedSession } from '../fixtures/auth.fixtures';
import {
	mockAvailability,
	mockTherapist,
	THERAPIST_ID,
} from '../fixtures/therapist.fixtures';

// Manual smoke check for the availability workspace redesign on
// /en/availability/workflow — verifies the route renders without throwing.

test.describe('Availability workspace render check', () => {
	test.beforeEach(async ({ page }) => {
		await setupAuthenticatedSession(page);

		await page.route('**/users/*/availability/by-day**', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ dates: [], totalPages: 1 }),
			});
		});

		await page.route('**/users/*/availability**', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(mockAvailability),
			});
		});

		await page.route('**/jupiter/availability**', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					bufferTimeMinutes: 10,
					googleCalendarConnected: false,
				}),
			});
		});

		await page.route(`**/users/${THERAPIST_ID}`, (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ user: mockTherapist }),
			});
		});

		await page.route('**/api/v1/users/*/conflicts/count**', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ count: 0 }),
			});
		});

		await page.route('**/api/v1/notifications**', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ notifications: [], totalPages: 1 }),
			});
		});
	});

	test('renders /en/availability/workflow without page errors', async ({
		page,
	}) => {
		const pageErrors: string[] = [];
		page.on('pageerror', (err) => pageErrors.push(`${err.message}\n${err.stack}`));

		await page.goto('/en/availability/workflow', { waitUntil: 'domcontentloaded' });
		await page.waitForTimeout(5000);

		expect(pageErrors).toEqual([]);
		await expect(page.getByTestId('availability-workspace')).toBeVisible();
	});

	test('redirects /availability/workflow to /en/availability/workflow', async ({
		page,
	}) => {
		await page.goto('/availability/workflow');
		await expect(page).toHaveURL(/\/en\/availability\/workflow/);
	});
});
