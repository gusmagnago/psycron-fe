import type { AppointmentDetailsBySlotIdResponse } from '@psycron/api/user/availability/index.types';

import type { IWeekSlot } from '../../../AvailabilityWeekPage.types';
import type { ISlotSessionSectionProps } from '../slot-session-section/SlotSessionSection.types';

export interface ISlotBookedBodyProps {
	appointmentDetails?: AppointmentDetailsBySlotIdResponse;
	bookingLink: string;
	isGoogle: boolean;
	isLoading?: boolean;
	isPast: boolean;
	patientName?: string;
	sessionDetails: ISlotSessionSectionProps;
	sessionType?: string;
	shareText: string;
	shareTitle: string;
	shareWith?: string;
	slot: IWeekSlot;
}
