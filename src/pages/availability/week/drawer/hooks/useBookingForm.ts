import { useForm } from 'react-hook-form';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import { usePatient } from '@psycron/context/patient/PatientContext';
import { getFormattedContacts } from '@psycron/hooks/useFormattedContacts';

import type { IAvailabilityWeekDrawerProps } from '../AvailabilityWeekDrawer.types';

export const useBookingForm = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	shareAddress: boolean
) => {
	const { bookAppointmentWithLink } = usePatient();
	const methods = useForm<ICreatePatientForm>({ mode: 'onChange' });
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const onSubmit = (formData: ICreatePatientForm) => {
		const { email, firstName, lastName } = formData;
		const { fullPhone, fullWhatsapp } = getFormattedContacts(formData);

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
				shareAddress,
				slotId: slot._id ?? slot.id,
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			},
		});
	};

	return { isSubmitting, methods, submitBooking: handleSubmit(onSubmit) };
};
