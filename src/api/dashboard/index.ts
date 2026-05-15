import apiClient from '@psycron/api/axios-instance';

import type { DashboardSummaryResponse } from './index.types';

export const getDashboardSummary = async (
	locale: 'en' | 'pt'
): Promise<DashboardSummaryResponse> => {
	const response = await apiClient.get<DashboardSummaryResponse>(
		'/dashboard/summary',
		{ params: { locale } }
	);

	return response.data;
};
