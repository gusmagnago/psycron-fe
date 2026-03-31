import type { UseFormReturn } from 'react-hook-form';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';

import type { ISlotLocationSectionProps } from '../slot-location-section/SlotLocationSection.types';

export interface ISlotAvailableBodyProps extends ISlotLocationSectionProps {
	methods: UseFormReturn<ICreatePatientForm>;
	sessionType?: string;
}
