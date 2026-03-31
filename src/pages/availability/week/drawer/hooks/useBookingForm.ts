import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { editSlot } from '@psycron/api/availability';
import {
	type ICreatePatientForm,
	RecurrencePattern,
} from '@psycron/api/patient/index.types';
import { bookSlotByTherapist } from '@psycron/api/user/availability';
import { useAlert } from '@psycron/context/alert/AlertContext';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { getFormattedContacts } from '@psycron/hooks/useFormattedContacts';
import { useQueryClient } from '@tanstack/react-query';

import type {
	IAvailabilityWeekDrawerProps,
	LocationChoice,
} from '../AvailabilityWeekDrawer.types';

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

	const onSubmit = async (formData: ICreatePatientForm) => {
		try {
			const { email, firstName, lastName, preferredContact } = formData;
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

			if (locationChoice === 'custom' && customAddress) {
				await editSlot({
					address: customAddress,
					availabilityDayId: slot.availabilityDayId ?? '',
					slotId: slot._id ?? slot.id,
					therapistId: therapistId ?? '',
				});
			}

			const { recurrencePattern } = formData;

			await bookSlotByTherapist({
				therapistId: therapistId ?? '',
				availabilityDayId: slot.availabilityDayId ?? '',
				slotId: slot._id ?? slot.id,
				patient: {
					contacts: {
						...(email ? { email } : {}),
						...(fullPhone ? { phone: fullPhone } : {}),
						...(fullWhatsapp ? { whatsapp: fullWhatsapp } : {}),
					},
					firstName,
					lastName,
					...(preferredContact?.type && preferredContact?.value
						? { preferredContact }
						: {}),
				},
				...(recurrencePattern ? { recurrencePattern } : {}),
				shouldReplicate: recurrencePattern
					? recurrencePattern !== RecurrencePattern.SINGLE
					: false,
				shareAddress: locationChoice === 'clinic',
				timeZone:
					formData.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
			});

			await queryClient.invalidateQueries({
				queryKey: ['therapistAvailability'],
			});

			showAlert({
				message: t('availability.week.drawer.booking-success'),
				severity: 'success',
			});

			onSuccess();
		} catch {
			showAlert({
				message: t('availability.week.drawer.booking-error'),
				severity: 'error',
			});
		}
	};

	return { isSubmitting, methods, submitBooking: handleSubmit(onSubmit) };
};
