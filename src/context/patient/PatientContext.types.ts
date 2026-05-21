import type { ReactNode } from 'react';
import type { IEditAppointment } from '@psycron/api/appointment/index.types';
import type {
	IBookAppointment,
	ICreateManualPatient,
	ICreatePatient,
	IEditPatientDetailsById,
} from '@psycron/api/patient/index.types';

export interface IPatientContextType {
	archivePatient: (patientId: string, onSuccess?: () => void) => void;
	archivePatientIsLoading: boolean;
	bookAppointmentFromLinkMttnIsLoading: boolean;
	bookAppointmentWithLink: (data: IBookAppointment) => void;
	createManualPatientIsLoading: boolean;
	createManualPatientMttn: (data: ICreateManualPatient) => void;
	createPatientIsLoading: boolean;
	createPatientMttn: (data: ICreatePatient) => void;
	patientEditAppointment: (data: IEditAppointment) => void;
	patientEditAppointmentIsLoading: boolean;
	updatePatientDetails: (data: IEditPatientDetailsById) => void;
	updatePatientIsLoading: boolean;
}

export interface IPatientProviderProps {
	children: ReactNode;
}
