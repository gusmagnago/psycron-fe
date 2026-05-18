import apiClient from '../axios-instance';

import type {
	ConsentPurpose,
	ConsentRecordsResponse,
	DataDeletionResponse,
	RecordConsentPayload,
} from './consent.types';

export const recordConsent = async (
	patientId: string,
	payload: RecordConsentPayload
): Promise<ConsentRecordsResponse> => {
	const response = await apiClient.post<ConsentRecordsResponse>(
		`/patient/${patientId}/consent`,
		payload
	);

	return response.data;
};

export const revokeConsent = async (
	patientId: string,
	purpose: ConsentPurpose
): Promise<ConsentRecordsResponse> => {
	const response = await apiClient.delete<ConsentRecordsResponse>(
		`/patient/${patientId}/consent/${purpose}`
	);

	return response.data;
};

export const getConsentRecords = async (
	patientId: string
): Promise<ConsentRecordsResponse> => {
	const response = await apiClient.get<ConsentRecordsResponse>(
		`/patient/${patientId}/consent`
	);

	return response.data;
};

export const requestDataDeletion = async (
	patientId: string
): Promise<DataDeletionResponse> => {
	const response = await apiClient.post<DataDeletionResponse>(
		'/patient/me/deletion-request',
		{ patientId }
	);

	return response.data;
};
