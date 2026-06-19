import { describe, expect, it } from 'vitest';

import { buildEditUserPayload, toEditUserDefaults } from './edituser.mapper';

describe('toEditUserDefaults', () => {
	it('pre-fills contacts.phone and clinicAddress from Google-sourced user details', () => {
		const defaults = toEditUserDefaults({
			firstName: 'Ada',
			lastName: 'Lovelace',
			contacts: { email: 'ada@example.com', phone: '+351911234567' },
			clinicAddress: {
				street: 'Rua Augusta 10',
				city: 'Lisbon',
				country: 'Portugal',
				postcode: '1100-053',
			},
		});

		expect(defaults.contacts.phone).toBe('+351911234567');
		expect(defaults.clinicAddress).toEqual({
			street: 'Rua Augusta 10',
			city: 'Lisbon',
			country: 'Portugal',
			postcode: '1100-053',
		});
	});

	it('falls back to empty strings when phone/address are absent', () => {
		const defaults = toEditUserDefaults({
			firstName: 'Ada',
			lastName: 'Lovelace',
			contacts: { email: 'ada@example.com' },
		});

		expect(defaults.contacts.phone).toBe('');
		expect(defaults.dateOfBirth).toBe('');
		expect(defaults.clinicAddress).toEqual({
			street: '',
			city: '',
			country: '',
			postcode: '',
		});
	});

	it('normalizes an ISO datetime dateOfBirth to a YYYY-MM-DD date-input value', () => {
		const defaults = toEditUserDefaults({
			firstName: 'Ada',
			lastName: 'Lovelace',
			contacts: { email: 'ada@example.com' },
			dateOfBirth: '1990-03-07T00:00:00.000Z',
		});

		expect(defaults.dateOfBirth).toBe('1990-03-07');
	});
});

describe('buildEditUserPayload', () => {
	const original = toEditUserDefaults({
		firstName: 'Ada',
		lastName: 'Lovelace',
		contacts: { email: 'ada@example.com', phone: '+351911234567' },
		clinicAddress: {
			street: 'Rua Augusta 10',
			city: 'Lisbon',
			country: 'Portugal',
			postcode: '1100-053',
		},
	});

	it('includes clinicAddress only when the clinic section is enabled', () => {
		const payload = buildEditUserPayload({
			userId: 'user-1',
			values: original,
			enabled: { clinicAddress: true, contacts: false, name: false },
			original,
		});

		expect(payload.data.clinicAddress).toEqual({
			street: 'Rua Augusta 10',
			city: 'Lisbon',
			country: 'Portugal',
			postcode: '1100-053',
		});
		expect(payload.data.contacts).toBeUndefined();
	});

	it('sends dateOfBirth when the name section is enabled, null when empty', () => {
		const withDob = buildEditUserPayload({
			userId: 'user-1',
			values: { ...original, dateOfBirth: '1990-03-07' },
			enabled: { clinicAddress: false, contacts: false, name: true },
			original,
		});
		expect(withDob.data.dateOfBirth).toBe('1990-03-07');

		const cleared = buildEditUserPayload({
			userId: 'user-1',
			values: { ...original, dateOfBirth: '' },
			enabled: { clinicAddress: false, contacts: false, name: true },
			original,
		});
		expect(cleared.data.dateOfBirth).toBeNull();
	});

	it('keeps the prefilled phone when contacts are edited without changing it', () => {
		const payload = buildEditUserPayload({
			userId: 'user-1',
			values: original,
			enabled: { clinicAddress: false, contacts: true, name: false },
			original,
		});

		expect(payload.data.contacts?.phone).toBe('+351911234567');
	});
});
