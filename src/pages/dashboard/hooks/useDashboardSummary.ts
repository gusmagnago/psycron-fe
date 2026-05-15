import { useTranslation } from 'react-i18next';
import { getDashboardSummary } from '@psycron/api/dashboard';
import type { DashboardSummaryResponse } from '@psycron/api/dashboard/index.types';
import { useQuery } from '@tanstack/react-query';

const normalizeLocale = (language: string): 'en' | 'pt' =>
	language.startsWith('pt') ? 'pt' : 'en';

export interface UseDashboardSummaryReturn {
	isLoading: boolean;
	summary?: DashboardSummaryResponse;
}

export const useDashboardSummary = (): UseDashboardSummaryReturn => {
	const { i18n } = useTranslation();
	const locale = normalizeLocale(i18n.language);

	const { data, isLoading } = useQuery({
		queryFn: () => getDashboardSummary(locale),
		queryKey: ['dashboard-summary', locale],
		staleTime: 5 * 60 * 1000,
	});

	return { isLoading, summary: data };
};
