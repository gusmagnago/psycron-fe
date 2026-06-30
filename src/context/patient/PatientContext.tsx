import { createContext, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { editAppointment } from '@psycron/api/appointment';
import type { IEditAppointment } from '@psycron/api/appointment/index.types';
import type { CustomError } from '@psycron/api/error';
import {
	archivePatientById,
	bookAppointmentFromLink,
	createManualPatient,
	createPatientFromSlot,
	getPatientById,
	updatePatientDetailsById,
} from '@psycron/api/patient';
import type {
	IBookAppointment,
	ICreateManualPatient,
	ICreatePatient,
	IEditPatientDetailsById,
} from '@psycron/api/patient/index.types';
import { QUERY_KEYS } from '@psycron/api/queryKeys';
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
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.therapistAvailability(),
			});
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
				queryKey: QUERY_KEYS.patientDetails(data.patient?._id?.toString()),
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

	const archivePatientMutation = useMutation({
		mutationFn: ({ patientId }: { patientId: string }) =>
			archivePatientById(patientId),
		onSuccess: (data, { patientId }) => {
			capture(PostHogEvent.PatientCenterArchiveConfirmed, {
				target_user_id: patientId,
			});
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patientDetails(patientId) });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patientList() });
			showAlert({
				message: data.message,
				severity: 'success',
			});
		},
		onError: (error: CustomError, { patientId }) => {
			capture(PostHogEvent.PatientCenterArchiveFailed, {
				error_code: error.message,
				target_user_id: patientId,
			});
			showAlert({
				message: error.message,
				severity: 'error',
			});
		},
	});

	const archivePatient = useCallback(
		(patientId: string, onSuccess?: () => void) => {
			archivePatientMutation.mutate({ patientId }, { onSuccess: onSuccess });
		},
		[archivePatientMutation]
	);

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

	const createManualPatientMutation = useMutation({
		mutationFn: createManualPatient,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patientList() });
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

	const createManualPatientMttn = (data: ICreateManualPatient) =>
		createManualPatientMutation.mutate(data);

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
				archivePatient,
				archivePatientIsLoading: archivePatientMutation.isPending,
				bookAppointmentWithLink,
				bookAppointmentFromLinkMttnIsLoading:
					bookAppointmentFromLinkMutation.isPending,
				createManualPatientIsLoading: createManualPatientMutation.isPending,
				createManualPatientMttn,
				createPatientIsLoading: createPatientMutation.isPending,
				createPatientMttn,
				patientEditAppointment,
				patientEditAppointmentIsLoading:
					patientEditAppointmentMutation.isPending,
				updatePatientDetails,
				updatePatientIsLoading: updatePatientMutation.isPending,
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

	const cachedPatient = queryClient.getQueryData<IPatient>(
		QUERY_KEYS.patientDetails(patientId)
	);

	const {
		data: patientDetails,
		isLoading: isPatientDetailsLoading,
		isSuccess: isPatientDetailsSucces,
	} = useQuery<IPatient>({
		queryKey: QUERY_KEYS.patientDetails(patientId),
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
