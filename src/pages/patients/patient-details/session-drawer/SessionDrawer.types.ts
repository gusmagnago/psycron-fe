import type { INotification } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import type { PatientSessionRow } from '../../PatientsPage.types';

export interface SessionDrawerRescheduleSlot {
	availabilityDayId: string;
	date: string;
	endTime: string;
	slotId: string;
	startTime: string;
}

export interface SessionDrawerRescheduleGroup {
	date: string;
	formattedDate: string;
	slots: SessionDrawerRescheduleSlot[];
}

export interface SessionDrawerProps {
	notifications?: INotification[];
	onClose: () => void;
	onRescheduleSuccess: () => void;
	patientId: string;
	patientName: string;
	publicSessionsLink: string;
	session: PatientSessionRow;
	therapistId: string | null;
}
