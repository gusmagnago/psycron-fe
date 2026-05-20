import { test, expect } from '@playwright/test';

import { multipleCalendars, singleCalendar } from './fixtures/calendar.fixtures';

const JUPITER_URL = '/en/availability/generate';
const CALENDAR_CONNECTED_URL = `${JUPITER_URL}?calendar=connected`;

test.describe('Google Calendar Picker — Jupiter flow', () => {
	test.beforeEach(async ({ page }) => {
		// Mock auth so the app doesn't redirect to login
		await page.addInitScript(() => {
			localStorage.setItem('_psy_ob', 'false');
			// Simulate a logged-in session via cookie stub if needed
		});
	});

	test('auto-selects and skips picker when user has only one (primary) calendar', async ({
		page,
	}) => {
		await page.route('**/auth/google/calendar/list', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ calendars: singleCalendar }),
			});
		});

		await page.route('**/auth/google/calendar/select', (route) => {
			route.fulfill({ status: 200, body: JSON.stringify({ status: 'success', calendarId: 'primary' }) });
		});

		await page.route('**/auth/google/calendar/status', (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({ connected: true, syncEnabled: true }),
			});
		});

		await page.goto(CALENDAR_CONNECTED_URL);

		// Picker should NOT be visible — auto-skipped
		await expect(page.getByText('Which calendar should Psycron use?')).not.toBeVisible();

		// Should advance to google-success post-connect options
		await expect(
			page.getByText('Your Google Calendar is now connected.')
		).toBeVisible({ timeout: 5000 });
	});

	test('shows calendar picker when user has multiple calendars', async ({ page }) => {
		await page.route('**/auth/google/calendar/list', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ calendars: multipleCalendars }),
			});
		});

		await page.route('**/auth/google/calendar/select', (route) => {
			route.fulfill({ status: 200, body: JSON.stringify({ status: 'success', calendarId: 'primary' }) });
		});

		await page.route('**/auth/google/calendar/status', (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({ connected: true, syncEnabled: true }),
			});
		});

		await page.goto(CALENDAR_CONNECTED_URL);

		await expect(
			page.getByText('Which calendar should Psycron use?')
		).toBeVisible({ timeout: 5000 });

		// All calendars should be rendered
		await expect(page.getByText('Personal')).toBeVisible();
		await expect(page.getByText('Work')).toBeVisible();
		await expect(page.getByText('Family')).toBeVisible();
	});

	test('selecting a calendar and confirming calls PATCH and advances to google-success', async ({
		page,
	}) => {
		let selectedCalendarId = '';

		await page.route('**/auth/google/calendar/list', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ calendars: multipleCalendars }),
			});
		});

		await page.route('**/auth/google/calendar/select', async (route) => {
			const body = JSON.parse(route.request().postData() ?? '{}') as { calendarId: string };
			selectedCalendarId = body.calendarId;
			route.fulfill({ status: 200, body: JSON.stringify({ status: 'success', calendarId: selectedCalendarId }) });
		});

		await page.route('**/auth/google/calendar/status', (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({ connected: true, syncEnabled: true }),
			});
		});

		await page.goto(CALENDAR_CONNECTED_URL);

		await expect(page.getByText('Which calendar should Psycron use?')).toBeVisible({
			timeout: 5000,
		});

		// Select the "Work" calendar
		await page.getByText('Work').click();

		// Confirm selection
		await page.getByRole('button', { name: 'Use this calendar' }).click();

		// Should have called PATCH with the work calendar ID
		expect(selectedCalendarId).toBe('work@example.com');

		// Should advance to google-success
		await expect(
			page.getByText('Your Google Calendar is now connected.')
		).toBeVisible({ timeout: 5000 });
	});

	test('falls through to google-success when calendar list API fails', async ({ page }) => {
		await page.route('**/auth/google/calendar/list', (route) => {
			route.fulfill({ status: 500, body: 'Internal Server Error' });
		});

		await page.route('**/auth/google/calendar/status', (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({ connected: true, syncEnabled: true }),
			});
		});

		await page.goto(CALENDAR_CONNECTED_URL);

		// Picker should not be stuck — falls through to google-success
		await expect(
			page.getByText('Your Google Calendar is now connected.')
		).toBeVisible({ timeout: 5000 });
	});
});

test.describe('GET /auth/google/calendar/list — route guard', () => {
	test('returns 401 for unauthenticated requests', async ({ request }) => {
		const response = await request.get('/auth/google/calendar/list');
		// Without a valid token, expect 401
		expect([401, 403]).toContain(response.status());
	});
});

test.describe('PATCH /auth/google/calendar/select — route guard', () => {
	test('returns 401 for unauthenticated requests', async ({ request }) => {
		const response = await request.patch('/auth/google/calendar/select', {
			data: { calendarId: 'primary' },
		});
		expect([401, 403]).toContain(response.status());
	});
});
