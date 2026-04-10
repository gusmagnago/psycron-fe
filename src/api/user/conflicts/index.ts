import apiClient from '@psycron/api/axios-instance';

import type {
	ConflictStatus,
	ConflictType,
	IGetConflictCountResponse,
	IGetConflictsResponse,
	IUpdateConflictPayload,
	IUpdateConflictResponse,
} from './index.types';

export const getConflicts = async ({
	status,
	therapistId,
	type,
}: {
	status?: ConflictStatus;
	therapistId: string;
	type?: ConflictType;
}): Promise<IGetConflictsResponse> => {
	const response = await apiClient.get<IGetConflictsResponse>(
		`/users/${therapistId}/conflicts`,
		{ params: { status, type } }
	);

	return response.data;
};

export const getConflictCount = async (
	therapistId: string
): Promise<IGetConflictCountResponse> => {
	const response = await apiClient.get<IGetConflictCountResponse>(
		`/users/${therapistId}/conflicts/count`
	);

	return response.data;
};

export const updateConflict = async ({
	actionTaken,
	conflictId,
	status,
	therapistId,
}: IUpdateConflictPayload): Promise<IUpdateConflictResponse> => {
	const response = await apiClient.patch<IUpdateConflictResponse>(
		`/users/${therapistId}/conflicts/${conflictId}`,
		{ actionTaken, status }
	);

	return response.data;
};
