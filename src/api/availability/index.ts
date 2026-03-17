import apiClient from '../axios-instance';

import type { IAvailabilityRecord } from './index.types';

// TODO PR-259: implement GET /jupiter/availability on the BE.
// Once live, replace the stub body with:
//   const response = await apiClient.get<IAvailabilityRecord>('/jupiter/availability');
//   return response.data;
// The setQueryData call in useJupiterFlow.handlePublish acts as the in-session
// bridge until this endpoint exists. Remove it once the API is live.
export const getAvailability = async (params?: {
	from?: string;
	to?: string;
}): Promise<IAvailabilityRecord | null> => {
	try {
		const response = await apiClient.get<IAvailabilityRecord>('/jupiter/availability', {
			params,
		});
		return response.data;
	} catch {
		return null;
	}
};
