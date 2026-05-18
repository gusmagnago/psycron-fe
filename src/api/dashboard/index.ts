import apiClient from '@psycron/api/axios-instance';

import type {
	DashboardSummaryResponse,
	SubmitDashboardWidgetFeedbackPayload,
	SubmitDashboardWidgetFeedbackResponse,
} from './index.types';

export const getDashboardSummary = async (
	locale: 'en' | 'pt'
): Promise<DashboardSummaryResponse> => {
	const response = await apiClient.get<DashboardSummaryResponse>(
		'/dashboard/summary',
		{ params: { locale } }
	);

	return response.data;
};

export const submitDashboardWidgetFeedback = async (
	payload: SubmitDashboardWidgetFeedbackPayload
): Promise<SubmitDashboardWidgetFeedbackResponse> => {
	const response = await apiClient.post<SubmitDashboardWidgetFeedbackResponse>(
		'/dashboard/widget-feedback',
		payload
	);

	return response.data;
};
