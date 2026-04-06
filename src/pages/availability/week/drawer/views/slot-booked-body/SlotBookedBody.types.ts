import type { AppointmentDetailsBySlotIdResponse } from '@psycron/api/user/availability/index.types';

import type { IWeekSlot } from '../../../AvailabilityWeekPage.types';

export interface ISlotBookedBodyProps {
	appointmentDetails?: AppointmentDetailsBySlotIdResponse;
	formattedDate: string;
	isGoogle: boolean;
	isLoading?: boolean;
	isPast: boolean;
	patientName?: string;
	patientTimeStr: string | null;
	sessionType?: string;
	slot: IWeekSlot;
	therapistTimeStr: string;
	timeSub: string;
}
