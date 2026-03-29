import { useForm } from 'react-hook-form';
import { editSlot } from '@psycron/api/availability';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import { usePatient } from '@psycron/context/patient/PatientContext';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { getFormattedContacts } from '@psycron/hooks/useFormattedContacts';

import type {
	IAvailabilityWeekDrawerProps,
	LocationChoice,
} from '../AvailabilityWeekDrawer.types';

export const useBookingForm = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	locationChoice: LocationChoice,
	customAddress: ISlotAddress | null
) => {
	const { bookAppointmentWithLink } = usePatient();
	const methods = useForm<ICreatePatientForm>({ mode: 'onChange' });
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const onSubmit = async (formData: ICreatePatientForm) => {
		const { email, firstName, lastName } = formData;
		const { fullPhone, fullWhatsapp } = getFormattedContacts(formData);

		if (locationChoice === 'custom' && customAddress) {
			await editSlot({
				address: customAddress,
				availabilityDayId: slot.availabilityDayId ?? '',
				slotId: slot._id ?? slot.id,
				therapistId: therapistId ?? '',
			});
		}

		bookAppointmentWithLink({
			therapistId,
			data: {
				availabilityDayId: slot.availabilityDayId ?? '',
				patient: {
					contacts: {
						email,
						phone: fullPhone,
						...(fullWhatsapp ? { whatsapp: fullWhatsapp } : {}),
					},
					firstName,
					lastName,
				},
				shouldReplicate: false,
				shareAddress: locationChoice === 'clinic',
				slotId: slot._id ?? slot.id,
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			},
		});
	};

	return { isSubmitting, methods, submitBooking: handleSubmit(onSubmit) };
};
