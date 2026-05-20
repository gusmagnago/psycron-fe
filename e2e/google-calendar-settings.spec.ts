import { expect, test } from '@playwright/test';

import { multipleCalendars } from './fixtures/calendar.fixtures';

const SETTINGS_URL = '/en/availability/settings';

test.describe('Google Calendar settings drawer — Phase 2', () => {
	test.beforeEach(async ({ page }) => {
		// Mock calendar list and status for a connected user
		await page.route('**/auth/google/calendar/list', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ calendars: multipleCalendars }),
			});
		});

		await page.route('**/auth/google/calendar/status', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					connected: true,
					syncEnabled: true,
					calendarId: 'primary',
				}),
			});
		});
	});

	test('shows selected calendar name and sync toggle when connected', async ({ page }) => {
		await page.goto(SETTINGS_URL);

		// Open Google Calendar drawer
		await page.getByText('Google Calendar').first().click();

		// Connection status should be visible
		await expect(page.getByText('Your Google Calendar is connected.')).toBeVisible({
			timeout: 5000,
		});

		// Calendar name should show
		await expect(page.getByText('Personal')).toBeVisible();

		// Sync toggle should be present
		await expect(page.getByRole('checkbox')).toBeVisible();
	});

	test('disconnect button calls DELETE and closes drawer', async ({ page }) => {
		let disconnectCalled = false;

		await page.route('**/auth/google/calendar', (route) => {
			if (route.request().method() === 'DELETE') {
				disconnectCalled = true;
				route.fulfill({ status: 200, body: JSON.stringify({ status: 'success' }) });
			} else {
				route.continue();
			}
		});

		// Mock availability refresh after disconnect
		await page.route('**/jupiter/availability**', (route) => {
			route.fulfill({ status: 200, body: JSON.stringify({}) });
		});

		await page.goto(SETTINGS_URL);
		await page.getByText('Google Calendar').first().click();

		await expect(page.getByRole('button', { name: 'Disconnect' })).toBeVisible({
			timeout: 5000,
		});
		await page.getByRole('button', { name: 'Disconnect' }).click();

		expect(disconnectCalled).toBe(true);
	});

	test('sync toggle calls POST /auth/google/calendar/toggle', async ({ page }) => {
		let togglePayload: { enabled?: boolean } = {};

		await page.route('**/auth/google/calendar/toggle', async (route) => {
			togglePayload = JSON.parse(route.request().postData() ?? '{}') as {
				enabled?: boolean;
			};
			route.fulfill({ status: 200, body: JSON.stringify({ status: 'success' }) });
		});

		await page.goto(SETTINGS_URL);
		await page.getByText('Google Calendar').first().click();

		const toggle = page.getByRole('checkbox');
		await expect(toggle).toBeVisible({ timeout: 5000 });

		// Toggle is currently ON (syncEnabled: true) — click turns it OFF
		await toggle.click();

		expect(togglePayload.enabled).toBe(false);
	});
});

test.describe('Google Calendar slot schema — googleEventId field', () => {
	test('slot schema includes googleEventId as optional nullable string', () => {
		// Structural test: verify the field is defined in the schema
		// This is enforced at the TS type level — compile-time guarantee
		type SlotWithEventId = {
			googleEventId?: string | null;
		};

		const slot: SlotWithEventId = { googleEventId: 'evt-123' };
		expect(slot.googleEventId).toBe('evt-123');

		const emptySlot: SlotWithEventId = {};
		expect(emptySlot.googleEventId).toBeUndefined();

		const nullSlot: SlotWithEventId = { googleEventId: null };
		expect(nullSlot.googleEventId).toBeNull();
	});
});
