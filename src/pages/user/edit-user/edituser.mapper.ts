// editUser.mapper.ts
import type { IEditUser } from '@psycron/api/user/index.types';
import type { IClinicAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import type { EditUserFormValues } from './EditUser.types';

type Contacts = {
	email?: string;
	phone?: string;
	whatsapp?: string;
};

type UserDetailsLike = {
	clinicAddress?: Partial<IClinicAddress>;
	contacts: Contacts;
	dateOfBirth?: string | null;
	firstName: string;
	lastName: string;
	password?: string;
};

export const toEditUserDefaults = (
	user: UserDetailsLike
): EditUserFormValues => ({
	clinicAddress: {
		city: user.clinicAddress?.city ?? '',
		country: user.clinicAddress?.country ?? '',
		postcode: user.clinicAddress?.postcode ?? '',
		street: user.clinicAddress?.street ?? '',
	},
	// Native date input expects 'YYYY-MM-DD'; the API returns an ISO datetime.
	dateOfBirth: user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : '',
	firstName: user.firstName ?? '',
	lastName: user.lastName ?? '',
	contacts: {
		email: user.contacts?.email ?? '',
		phone: user.contacts?.phone ?? '',
		whatsapp: user.contacts?.whatsapp ?? '',
	},
	password: user.password ?? '',
});

export const buildEditUserPayload = (args: {
	enabled: { clinicAddress: boolean; contacts: boolean; name: boolean; password?: boolean };
	original: EditUserFormValues;
	userId: string;
	values: EditUserFormValues;
}): IEditUser => {
	const { userId, values, enabled, original } = args;

	const data: IEditUser['data'] = {};

	if (enabled.name) {
		data.firstName = values.firstName.trim() || original.firstName;
		data.lastName = values.lastName.trim() || original.lastName;
		// '' clears the DOB; the BE guard treats an empty value as "unset".
		data.dateOfBirth = values.dateOfBirth?.trim() || null;
	}

	if (enabled.clinicAddress) {
		data.clinicAddress = {
			city: values.clinicAddress?.city?.trim() ?? '',
			country: values.clinicAddress?.country?.trim() ?? '',
			postcode: values.clinicAddress?.postcode?.trim() ?? '',
			street: values.clinicAddress?.street?.trim() ?? '',
		} satisfies IClinicAddress;
	}

	if (enabled.contacts) {
		const email = values.contacts.email.trim() || original.contacts.email;
		const phone = values.contacts.phone?.trim() || original.contacts.phone;

		const hasWhatsApp =
			values.contacts.hasWhatsApp ?? original.contacts.hasWhatsApp ?? false;

		const isPhoneWpp =
			values.contacts.isPhoneWpp ?? original.contacts.isPhoneWpp ?? false;

		const whatsapp = !hasWhatsApp
			? null
			: isPhoneWpp
				? (phone ?? null)
				: values.contacts.whatsapp?.trim() ||
					original.contacts.whatsapp ||
					null;

		data.contacts = {
			email,
			phone: phone ?? null,
			whatsapp,

			hasWhatsApp,
			isPhoneWpp: hasWhatsApp ? isPhoneWpp : false,
		};
	}

	return { userId, data };
};
