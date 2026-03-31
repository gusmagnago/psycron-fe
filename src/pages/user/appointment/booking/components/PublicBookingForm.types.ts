import type { UseFormReturn } from 'react-hook-form';

import type { IBookingFormValues } from '../BookAppointment.types';

export interface IPublicBookingFormProps {
	letPatientChooseAddress: boolean;
	methods: UseFormReturn<IBookingFormValues>;
}
