import type { ICancelEditAppointmentResponse } from '@psycron/api/appointment/index.types';
import apiClient from '@psycron/api/axios-instance';
import type { IAvailabilityDate } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import type {
	Appointment,
	AppointmentDetailsBySlotIdResponse,
	BookAppointmentResponse,
	CancelAppointmentPayload,
	CancelAppointmentResponse,
	IAvailabilityData,
	IBookSlotByTherapistPayload,
	IBookSlotByTherapistResponse,
	ICheckDuplicatePayload,
	ICheckDuplicateResponse,
	ICompleteSessionAvailabilityData,
	ICompleteSessionAvailabilityResponse,
	IEditSlotStatus,
	IInitiateAvailabilityResponse,
	IPatientSearchResponse,
	IPublicSlotDetailsResponse,
	ISessionResponse,
	IUpdateAvailabilitySession,
} from './index.types';

export const initiateAvailabilitySession = async (
	data: IAvailabilityData
): Promise<IInitiateAvailabilityResponse> => {
	const response = await apiClient.post<IInitiateAvailabilityResponse>(
		'/users/availability/initiate',
		data
	);

	return response.data;
};

export const updateAvailabilitySession = async ({
	sessionId,
	data,
}: IUpdateAvailabilitySession) => {
	const response = await apiClient.put(
		`/users/availability/session/${sessionId}`,
		data
	);

	return response.data;
};

export const completeSessionAvailability = async (
	sessionId: string,
	data: ICompleteSessionAvailabilityData
): Promise<ICompleteSessionAvailabilityResponse> => {
	const response = await apiClient.post<ICompleteSessionAvailabilityResponse>(
		`/users/availability/complete/${sessionId}`,
		data
	);

	return response.data;
};

export const getAvailabilitySession = async (
	sessionId: Partial<IAvailabilityDate>
): Promise<ISessionResponse> => {
	const response = await apiClient.get(
		`/users/availability/session/${sessionId}`
	);
	return response.data.session;
};

export const bookAppointment = async (
	data: Appointment
): Promise<BookAppointmentResponse> => {
	const { therapistId } = data;

	const response = await apiClient.post(
		`/users/availability/${therapistId}/book`,
		data
	);

	return response.data;
};

export const getAppointmentDetailsBySlotId = async (
	therapistId: string,
	availabilityDayId: string,
	slotId: string
): Promise<AppointmentDetailsBySlotIdResponse> => {
	const response = await apiClient.get(
		`/users/${therapistId}/availability/${availabilityDayId}/${slotId}`
	);
	return response.data;
};

export const editSlotStatus = async ({
	availabilityDayId,
	data,
	slotId,
	therapistId,
}: IEditSlotStatus) => {
	const response = await apiClient.post<ICancelEditAppointmentResponse>(
		`/users/${therapistId}/availability/${availabilityDayId}/slot/${slotId}`,
		data
	);
	return response.data;
};

export const getPublicSlotDetailsById = async (
	therapistId: string,
	slotId: string
): Promise<IPublicSlotDetailsResponse> => {
	const response = await apiClient.get(`/users/${therapistId}/${slotId}`);
	return response.data;
};

export const bookSlotByTherapist = async ({
	therapistId,
	availabilityDayId,
	slotId,
	...data
}: IBookSlotByTherapistPayload): Promise<IBookSlotByTherapistResponse> => {
	const response = await apiClient.post<IBookSlotByTherapistResponse>(
		`/users/${therapistId}/availability/${availabilityDayId}/slot/${slotId}/book`,
		data
	);
	return response.data;
};

export const searchPatients = async (
	therapistId: string,
	query: string
): Promise<IPatientSearchResponse> => {
	const response = await apiClient.get<IPatientSearchResponse>(
		`/users/${therapistId}/patients/search`,
		{ params: { q: query } }
	);
	return response.data;
};

export const checkDuplicatePatient = async (
	therapistId: string,
	payload: ICheckDuplicatePayload
): Promise<ICheckDuplicateResponse> => {
	const response = await apiClient.post<ICheckDuplicateResponse>(
		`/users/${therapistId}/patients/check-duplicate`,
		payload
	);
	return response.data;
};

export const cancelAppointmentByPatient = async (
	payload: CancelAppointmentPayload
): Promise<CancelAppointmentResponse> => {
	const { therapistId, slotId } = payload;

	const response = await apiClient.post(
		`/users/${therapistId}/cancel/${slotId}`,
		payload
	);

	return response.data;
};
