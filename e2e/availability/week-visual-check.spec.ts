import { expect, test } from '@playwright/test';

import { setupAuthenticatedSession } from '../fixtures/auth.fixtures';
import {
	DAY_ID,
	FUTURE_DATE,
	FUTURE_DATE_ISO,
	mockTherapist,
	THERAPIST_ID,
} from '../fixtures/therapist.fixtures';

// Visual check for two fixes on feat/availability-workspace-redesign:
//  1. Google booked slots without a per-event colorId must paint the calendar
//     color co-located on the /availability response — no flash to Peacock blue
//     while a slower config query resolves.
//  2. Busy slots get a dedicated drawer body (no booked template, no booking
//     link, no patient/online-session badge).

const SAGE_GREEN = '#33B679'; // co-located on the slots response (fast path)
const SAGE_GREEN_RGB = 'rgb(51, 182, 121)';
const TOMATO_RED = '#D50000'; // only on the slow config — must NOT win

const availabilityWithGoogleAndBusy = {
	dates: [
		{
			date: FUTURE_DATE_ISO,
			dateId: DAY_ID,
			slots: [
				{
					_id: 'slot-google',
					startTime: '09:00',
					endTime: '10:00',
					status: 'BOOKED',
					source: 'google',
					googleEventId: 'evt-1',
					// No googleColorId on purpose — must fall back to the calendar color.
					note: 'External therapy session',
				},
				{
					_id: 'slot-busy',
					startTime: '11:00',
					endTime: '12:00',
					status: 'BUSY',
					note: 'Dentist appointment',
				},
				{
					_id: 'slot-available',
					startTime: '13:00',
					endTime: '14:00',
					status: 'AVAILABLE',
					deliveryMode: 'online',
				},
			],
		},
	],
	firstDate: { date: FUTURE_DATE_ISO, dateId: DAY_ID },
	lastDate: { date: FUTURE_DATE_ISO, dateId: DAY_ID },
	isEmpty: false,
	totalPages: 1,
	googleCalendarColor: SAGE_GREEN,
};

test.describe('Availability week — Google color + busy drawer', () => {
	test.beforeEach(async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
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
				body: JSON.stringify(availabilityWithGoogleAndBusy),
			});
		});

		// Slow config carries a DIFFERENT color — if the card ever paints red the
		// page is reading the wrong (slow) source.
		await page.route('**/jupiter/availability**', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					bufferTimeMinutes: 0,
					googleCalendarConnected: true,
					googleCalendarColor: TOMATO_RED,
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

	test('Google booked slot paints the calendar color, not Peacock blue', async ({
		page,
	}) => {
		await page.goto(`/en/availability/week/${FUTURE_DATE}`, {
			waitUntil: 'domcontentloaded',
		});

		const googleSlot = page.getByTestId('availability-event-google').first();
		await expect(googleSlot).toBeVisible({ timeout: 15000 });

		// The slots response color (Sage green) must win over the slow config red.
		await expect(googleSlot).toHaveCSS('background-color', SAGE_GREEN_RGB);
	});

	test('busy slot opens the dedicated busy drawer (no booking template)', async ({
		page,
	}) => {
		await page.goto(`/en/availability/week/${FUTURE_DATE}`, {
			waitUntil: 'domcontentloaded',
		});

		await page.locator('#availability-slot-slot-busy').click();

		// The drawer is a role=dialog labelled by its title ("Busy" for busy slots).
		const drawer = page.getByRole('dialog', { name: 'Busy' });
		await expect(drawer).toBeVisible({ timeout: 15000 });

		// Dedicated busy copy is present…
		await expect(drawer.getByText('Dentist appointment')).toBeVisible();
		await expect(
			drawer.getByText('Personal commitment — synced to Google Calendar')
		).toBeVisible();

		// …and the wrong booked-template bits are absent.
		await expect(drawer.getByText('Booking link')).toHaveCount(0);
		await expect(drawer.getByText('Online session')).toHaveCount(0);
	});
});
