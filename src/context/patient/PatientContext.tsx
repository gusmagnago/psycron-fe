import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { editAppointment } from '@psycron/api/appointment';
import type { IEditAppointment } from '@psycron/api/appointment/index.types';
import type { CustomError } from '@psycron/api/error';
import {
	bookAppointmentFromLink,
	createPatientFromSlot,
	getPatientById,
	updatePatientDetailsById,
} from '@psycron/api/patient';
import type {
	IBookAppointment,
	ICreatePatient,
	IEditPatientDetailsById,
} from '@psycron/api/patient/index.types';
import { useSecureStorage } from '@psycron/hooks/useSecureStorage';
import i18n from '@psycron/i18n';
import { APPOINTMENTCONFIRMATION, APPOINTMENTS } from '@psycron/pages/urls';
import { LATESTPATIENT_ID } from '@psycron/utils/tokens';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAlert } from '../alert/AlertContext';
import type { IPatient } from '../user/auth/UserAuthenticationContext.types';

import type {
	IPatientContextType,
	IPatientProviderProps,
} from './PatientContext.types';

const PatientContext = createContext<IPatientContextType | undefined>(
	undefined
);

export const PatientProvider = ({ children }: IPatientProviderProps) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { showAlert } = useAlert();

	const bookAppointmentFromLinkMutation = useMutation({
		mutationFn: bookAppointmentFromLink,
		onSuccess: (data) => {
			navigate(
				`/${i18n.language}/${data.therapistId}/${data.patient._id}/${APPOINTMENTCONFIRMATION}`
			);
			showAlert({
				message: data.message,
				severity: 'success',
			});
		},
		onError: (error: CustomError) => {
			showAlert({
				message: error.message,
				severity: 'error',
			});
		},
	});

	const bookAppointmentWithLink = (data: IBookAppointment) =>
		bookAppointmentFromLinkMutation.mutate(data);

	const updatePatientMutation = useMutation({
		mutationFn: updatePatientDetailsById,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ['patientDetails', data.patient?._id],
			});

			showAlert({
				message: data.message,
				severity: 'success',
			});
		},
		onError: (error: CustomError) => {
			showAlert({
				message: error.message,
				severity: 'error',
			});
		},
	});

	const updatePatientDetails = (data: IEditPatientDetailsById) =>
		updatePatientMutation.mutate(data);

	const createPatientMutation = useMutation({
		mutationFn: createPatientFromSlot,
		onSuccess: (data) => {
			navigate(`/${i18n.language}/${APPOINTMENTS}`);
			showAlert({
				message: data.message,
				severity: 'success',
			});
		},
		onError: (error: CustomError) => {
			showAlert({
				message: error.message,
				severity: 'error',
			});
		},
	});

	const createPatientMttn = (data: ICreatePatient) =>
		createPatientMutation.mutate(data);

	const patientEditAppointmentMutation = useMutation({
		mutationFn: editAppointment,
		onSuccess: (data) => {
			navigate(
				`/${i18n.language}/${data.therapistId}/${data.patientId}/${APPOINTMENTCONFIRMATION}`
			);
			showAlert({
				message: data.message,
				severity: 'success',
			});
		},
		onError: (error: CustomError) => {
			showAlert({
				message: error.message,
				severity: 'error',
			});
		},
	});

	const patientEditAppointment = (data: IEditAppointment) =>
		patientEditAppointmentMutation.mutate(data);

	return (
		<PatientContext.Provider
			value={{
				bookAppointmentWithLink,
				bookAppointmentFromLinkMttnIsLoading:
					bookAppointmentFromLinkMutation.isPending,
				updatePatientDetails,
				updatePatientIsLoading: updatePatientMutation.isPending,
				createPatientMttn,
				createPatientIsLoading: createPatientMutation.isPending,
				patientEditAppointment,
				patientEditAppointmentIsLoading:
					patientEditAppointmentMutation.isPending,
			}}
		>
			{children}
		</PatientContext.Provider>
	);
};

export const usePatient = (therapisId?: string, patientId?: string | null) => {
	const context = useContext(PatientContext);
	if (!context) {
		throw new Error('usePatient must be used within an PatientProvider');
	}

	const queryClient = useQueryClient();

	const cachedPatient = queryClient.getQueryData<IPatient>([
		'patientDetails',
		patientId,
	]);

	const {
		data: patientDetails,
		isLoading: isPatientDetailsLoading,
		isSuccess: isPatientDetailsSucces,
	} = useQuery<IPatient>({
		queryKey: ['patientDetails', patientId],
		queryFn: () => getPatientById(therapisId as string, patientId as string),
		enabled: Boolean(therapisId && patientId && patientId !== 'undefined'),
		initialData: cachedPatient,
	});

	const latestPatientId = useSecureStorage(
		LATESTPATIENT_ID,
		patientDetails?._id,
		30,
		'session'
	);

	return {
		...context,
		patientDetails,
		isPatientDetailsLoading,
		isPatientDetailsSucces,
		latestPatientId,
	};
};
