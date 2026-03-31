import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { editSlot } from '@psycron/api/availability';
import {
	type ICreatePatientForm,
	RecurrencePattern,
} from '@psycron/api/patient/index.types';
import {
	bookSlotByTherapist,
	checkDuplicatePatient,
} from '@psycron/api/user/availability';
import type { IPatientConflictCandidate } from '@psycron/api/user/availability/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { getFormattedContacts } from '@psycron/hooks/useFormattedContacts';
import { useQueryClient } from '@tanstack/react-query';

import type {
	IAvailabilityWeekDrawerProps,
	LocationChoice,
} from '../AvailabilityWeekDrawer.types';

export type ConflictMatch =
	| { kind: 'single'; patient: IPatientConflictCandidate }
	| { kind: 'multiple'; patients: IPatientConflictCandidate[] };

interface IPendingBooking {
	contacts: { email?: string; phone: string; whatsapp?: string };
	existingPatientId?: string;
	firstName: string;
	lastName: string;
	preferredContact?: ICreatePatientForm['preferredContact'];
	recurrencePattern?: RecurrencePattern;
	timeZone: string;
}

export const useBookingForm = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	locationChoice: LocationChoice,
	customAddress: ISlotAddress | null,
	onSuccess: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const methods = useForm<ICreatePatientForm>({ mode: 'onChange' });
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const [conflict, setConflict] = useState<ConflictMatch | null>(null);
	const [pendingBooking, setPendingBooking] = useState<IPendingBooking | null>(
		null
	);

	const buildPayload = (
		formData: ICreatePatientForm
	): IPendingBooking => {
		const { email, firstName, lastName, preferredContact, recurrencePattern } =
			formData;
		const { fullPhone: rawPhone, fullWhatsapp: rawWhatsapp } =
			getFormattedContacts(formData);

		const phoneFromPreferred =
			preferredContact?.type === 'phone' || preferredContact?.type === 'whatsapp'
				? preferredContact.value
				: undefined;

		const fullPhone = phoneFromPreferred || rawPhone;
		const fullWhatsapp =
			preferredContact?.type === 'whatsapp'
				? preferredContact.value || rawWhatsapp
				: rawWhatsapp;

		return {
			contacts: {
				...(email ? { email } : {}),
				...(fullPhone ? { phone: fullPhone } : {}),
				...(fullWhatsapp ? { whatsapp: fullWhatsapp } : {}),
			} as IPendingBooking['contacts'],
			firstName,
			lastName,
			preferredContact,
			recurrencePattern,
			timeZone:
				formData.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
	};

	const executeBooking = async (payload: IPendingBooking) => {
		if (locationChoice === 'custom' && customAddress) {
			await editSlot({
				address: customAddress,
				availabilityDayId: slot.availabilityDayId ?? '',
				slotId: slot._id ?? slot.id,
				therapistId: therapistId ?? '',
			});
		}

		await bookSlotByTherapist({
			therapistId: therapistId ?? '',
			availabilityDayId: slot.availabilityDayId ?? '',
			slotId: slot._id ?? slot.id,
			patient: {
				contacts: payload.contacts,
				firstName: payload.firstName,
				lastName: payload.lastName,
				...(payload.preferredContact?.type && payload.preferredContact?.value
					? { preferredContact: payload.preferredContact }
					: {}),
			},
			...(payload.recurrencePattern ? { recurrencePattern: payload.recurrencePattern } : {}),
			shouldReplicate: payload.recurrencePattern
				? payload.recurrencePattern !== RecurrencePattern.SINGLE
				: false,
			shareAddress: locationChoice === 'clinic',
			timeZone: payload.timeZone,
			...(payload.existingPatientId
				? { existingPatientId: payload.existingPatientId }
				: {}),
		});

		await queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });

		showAlert({
			message: t('availability.week.drawer.booking-success'),
			severity: 'success',
		});

		onSuccess();
	};

	const onSubmit = async (formData: ICreatePatientForm) => {
		try {
			const payload = buildPayload(formData);

			// Phase 1: conflict check (only when phone is present)
			if (payload.contacts.phone) {
				const result = await checkDuplicatePatient(therapistId ?? '', {
					contacts: {
						phone: payload.contacts.phone,
						...(payload.contacts.email ? { email: payload.contacts.email } : {}),
					},
				});

				if (result.conflict) {
					setPendingBooking(payload);
					setConflict(
						result.match === 'single'
							? { kind: 'single', patient: result.patient }
							: { kind: 'multiple', patients: result.patients }
					);
					return;
				}
			}

			// Phase 2: no conflict — book directly
			await executeBooking(payload);
		} catch {
			showAlert({
				message: t('availability.week.drawer.booking-error'),
				severity: 'error',
			});
		}
	};

	const confirmWithExisting = async (existingPatientId: string) => {
		if (!pendingBooking) return;
		try {
			await executeBooking({ ...pendingBooking, existingPatientId });
		} catch {
			showAlert({
				message: t('availability.week.drawer.booking-error'),
				severity: 'error',
			});
		} finally {
			setConflict(null);
			setPendingBooking(null);
		}
	};

	const dismissConflict = () => {
		setConflict(null);
		setPendingBooking(null);
	};

	return {
		conflict,
		confirmWithExisting,
		dismissConflict,
		isSubmitting,
		methods,
		submitBooking: handleSubmit(onSubmit),
	};
};
