import type { IPatient } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import apiClient from '../axios-instance';

import type {
	IBookAppointment,
	IBookAppointmentResponse,
	ICreateManualPatient,
	ICreatePatient,
	ICreatePatientResponse,
	IEditPatientDetailsById,
	IEditPatientDetailsByIdResponse,
	IPatientByIdResponse,
	IPublicPatientSessionsResponse,
	IUpdatePatientNotificationPreferencesPayload,
	IUpdatePatientNotificationPreferencesResponse,
} from './index.types';

export const bookAppointmentFromLink = async ({
	therapistId,
	data,
}: IBookAppointment): Promise<IBookAppointmentResponse> => {
	const response = await apiClient.post<IBookAppointmentResponse>(
		`/patient/${therapistId}/book-appointment`,
		data
	);

	return response.data;
};

export const getPatientById = async (
	therapistId: string,
	patientId: string
): Promise<IPatient> => {
	const response = await apiClient.get<IPatientByIdResponse>(
		`/patient/${therapistId}/patients/${patientId}`
	);

	return response.data.patient;
};

export const updatePatientDetailsById = async ({
	patientId,
	patient,
}: IEditPatientDetailsById): Promise<IEditPatientDetailsByIdResponse> => {
	const response = await apiClient.put<IEditPatientDetailsByIdResponse>(
		`/patient/${patientId}`,
		patient
	);

	return response.data;
};

export const getPublicPatientSessions = async (
	patientId: string
): Promise<IPublicPatientSessionsResponse> => {
	const response = await apiClient.get<IPublicPatientSessionsResponse>(
		`/patient/${patientId}/sessions`
	);
	return response.data;
};

export const updatePatientNotificationPreferences = async (
	patientId: string,
	payload: IUpdatePatientNotificationPreferencesPayload
): Promise<IUpdatePatientNotificationPreferencesResponse> => {
	const response =
		await apiClient.patch<IUpdatePatientNotificationPreferencesResponse>(
			`/patient/${patientId}/notification-preferences`,
			payload
		);

	return response.data;
};

export const createManualPatient = async ({
	therapistId,
	patient,
}: ICreateManualPatient): Promise<ICreatePatientResponse> => {
	const response = await apiClient.post<ICreatePatientResponse>(
		`/patient/${therapistId}/create`,
		patient
	);

	return response.data;
};

export const createPatientFromSlot = async ({
	therapistId,
	availabilityDayId,
	slotId,
	patient,
}: ICreatePatient): Promise<ICreatePatientResponse> => {
	const url = slotId
		? `/patient/${therapistId}/create/${availabilityDayId}/${slotId}`
		: `/patient/${therapistId}/create/${availabilityDayId}`;

	const response = await apiClient.post<ICreatePatientResponse>(url, patient);

	return response.data;
};
