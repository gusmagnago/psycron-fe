import { expect, test } from '@playwright/test';

import { setupAuthenticatedSession } from './fixtures/auth.fixtures';
import { mockTherapist, THERAPIST_ID } from './fixtures/therapist.fixtures';

// A therapist whose contact + clinic details were pre-filled from their Google
// profile during OAuth sign-up (PR-336). The edit page must surface these so the
// user.phonenumbers.read / user.addresses.read scopes are demonstrably used.
const googlePrefilledTherapist = {
	...mockTherapist,
	authProvider: 'google',
	dateOfBirth: '1990-03-07T00:00:00.000Z',
	contacts: { email: 'ana@clinic.com', phone: '+351911234567' },
	clinicAddress: {
		street: 'Rua Augusta 10',
		city: 'Lisbon',
		country: 'Portugal',
		postcode: '1100-053',
	},
	consent: {
		marketingEmailsAcceptedAt: null,
		termsAcceptedAt: '2026-01-01T00:00:00.000Z',
		privacyPolicyAcceptedAt: '2026-01-01T00:00:00.000Z',
		dataProcessingAcceptedAt: '2026-01-01T00:00:00.000Z',
	},
};

test.describe('Edit user — Google profile pre-fill', () => {
	test.beforeEach(async ({ page }) => {
		await setupAuthenticatedSession(page);

		// Keep token refresh succeeding so an incidental 401 from an unmocked
		// layout-level call can't trip the interceptor into a sign-in redirect.
		await page.route('**/token/refresh-token', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					accessToken: 'mock-access-token',
					refreshToken: 'mock-refresh-token',
				}),
			});
		});

		// AvailabilityGate redirects to /availability/generate when getAvailability
		// returns null, so return a non-null record to keep us on the edit page.
		await page.route('**/jupiter/availability', (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ id: 'availability-001' }),
			});
		});

		// The edit page also fetches sub-resources (conflicts count, availability).
		// Left unmocked they hit the real backend, 401, and trip the axios 401
		// interceptor → logout, which unmounts the form before we can assert.
		await page.route(`**/users/${THERAPIST_ID}/**`, (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ count: 0, dates: [] }),
			});
		});

		await page.route(`**/users/${THERAPIST_ID}`, (route) => {
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ user: googlePrefilledTherapist }),
			});
		});
	});

	test('pre-fills the clinic address from the Google profile', async ({
		page,
	}) => {
		await page.goto(`/en/edit/${THERAPIST_ID}/clinicAddress`);

		await expect(page.getByTestId('edit-user-section-clinic')).toBeVisible();

		await expect(page.getByTestId('address-form-street')).toHaveValue(
			'Rua Augusta 10'
		);
		await expect(page.getByTestId('address-form-city')).toHaveValue('Lisbon');
		await expect(page.getByTestId('address-form-postcode')).toHaveValue(
			'1100-053'
		);
		await expect(page.getByTestId('address-form-country')).toHaveValue(
			'Portugal'
		);
	});

	test('pre-fills the phone number from the Google profile', async ({
		page,
	}) => {
		await page.goto(`/en/edit/${THERAPIST_ID}/contacts`);

		await expect(page.getByTestId('edit-user-section-contact')).toBeVisible();

		const phoneInput = page.getByTestId('contacts-form-phone').locator('input');
		const value = await phoneInput.inputValue();
		// react-phone-number-input formats the value, so compare on digits only.
		expect(value.replace(/\D/g, '')).toContain('911234567');
	});

	test('pre-fills the date of birth from the Google profile', async ({
		page,
	}) => {
		await page.goto(`/en/edit/${THERAPIST_ID}/name`);

		await expect(page.getByTestId('edit-user-section-name')).toBeVisible();
		await expect(page.getByTestId('name-form-date-of-birth')).toHaveValue(
			'1990-03-07'
		);
	});
});
