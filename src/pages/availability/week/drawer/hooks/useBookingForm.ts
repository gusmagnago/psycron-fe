import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
	onSuccess: () => void,
	selectedPatientId?: string | null,
	sessionType?: string
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const methods = useForm<ICreatePatientForm>({ mode: 'onTouched' });
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const [conflict, setConflict] = useState<ConflictMatch | null>(null);
	const [isChecking, setIsChecking] = useState(false);
	const [pendingBooking, setPendingBooking] = useState<IPendingBooking | null>(
		null
	);

	const buildPayload = (formData: ICreatePatientForm): IPendingBooking => {
		const { email, firstName, lastName, preferredContact, recurrencePattern } =
			formData;
		const { fullPhone: rawPhone, fullWhatsapp: rawWhatsapp } =
			getFormattedContacts(formData);

		const phoneFromPreferred =
			preferredContact?.type === 'phone' ||
			preferredContact?.type === 'whatsapp'
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
		const deliveryMode = sessionType === 'ONLINE' ? 'online' : 'in-person';

		await bookSlotByTherapist({
			therapistId: therapistId ?? '',
			availabilityDayId: slot.availabilityDayId ?? '',
			slotId: slot._id ?? slot.id,
			deliveryMode,
			patient: {
				contacts: payload.contacts,
				firstName: payload.firstName,
				lastName: payload.lastName,
				...(payload.preferredContact?.type && payload.preferredContact?.value
					? { preferredContact: payload.preferredContact }
					: {}),
			},
			...(payload.recurrencePattern
				? { recurrencePattern: payload.recurrencePattern }
				: {}),
			shouldReplicate: payload.recurrencePattern
				? payload.recurrencePattern !== RecurrencePattern.SINGLE
				: false,
			shareAddress: locationChoice === 'clinic',
			...(locationChoice === 'custom' && customAddress
				? { patientAddress: customAddress }
				: {}),
			timeZone: payload.timeZone,
			...(payload.existingPatientId
				? { existingPatientId: payload.existingPatientId }
				: {}),
		});

		await queryClient.invalidateQueries({
			queryKey: ['therapistAvailability'],
		});

		showAlert({
			message: t('availability.week.drawer.booking-success'),
			severity: 'success',
		});

		onSuccess();
	};

	const onSubmit = async (formData: ICreatePatientForm) => {
		try {
			const payload = buildPayload(formData);

			// Skip conflict check when an existing patient was selected
			if (selectedPatientId) {
				await executeBooking({ ...payload, existingPatientId: selectedPatientId });
				return;
			}

			// Phase 1: conflict check (when phone or email is present)
			if (payload.contacts.phone || payload.contacts.email) {
				setIsChecking(true);
				const result = await checkDuplicatePatient(therapistId ?? '', {
					contacts: {
						...(payload.contacts.phone
							? { phone: payload.contacts.phone }
							: {}),
						...(payload.contacts.email
							? { email: payload.contacts.email }
							: {}),
					} as { email?: string; phone: string },
				});
				setIsChecking(false);

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
		} catch (error) {
			setIsChecking(false);
			const msg = error instanceof Error ? error.message : undefined;
			showAlert({
				message: msg || t('availability.week.drawer.booking-error'),
				severity: 'error',
			});
		}
	};

	const confirmWithExisting = async (existingPatientId: string) => {
		if (!pendingBooking) return;
		try {
			await executeBooking({ ...pendingBooking, existingPatientId });
		} catch (error) {
			const msg = error instanceof Error ? error.message : undefined;
			showAlert({
				message: msg || t('availability.week.drawer.booking-error'),
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
		isChecking,
		isSubmitting,
		methods,
		submitBooking: handleSubmit(onSubmit),
	};
};
