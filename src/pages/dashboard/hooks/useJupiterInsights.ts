import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { DashboardBillingReadiness } from '@psycron/api/dashboard/index.types';
import {
	type BeInsightActionTarget,
	type BeInsightCategory,
	type BeInsightItem,
	type BeJupiterInsightsResponse,
	getJupiterInsights,
} from '@psycron/api/jupiter';
import type {
	InsightTier,
	JupiterInsight,
} from '@psycron/components/dashboard/widgets/jupiter-insights-widget/JupiterInsightsWidget.types';
import type { WeekMetrics } from '@psycron/pages/dashboard/hooks/useDashboardSlots';
import {
	AVAILABILITYWEEK_BASE,
	AVAILABILITYWIZARD,
	NOTIFICATIONSETTINGS,
	PATIENTPROFILE,
	PATIENTS,
} from '@psycron/pages/urls';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

const MAX_INSIGHTS = 5;
const PATIENT_MILESTONES = [1, 5, 10, 20, 50] as const;

export interface UseJupiterInsightsInput {
	billingReadiness: DashboardBillingReadiness;
	hasAvailability: boolean;
	metrics: WeekMetrics;
	patientCount: number;
	weekStart: string;
	whatsappRemindersEnabled?: boolean;
}

export interface UseJupiterInsightsReturn {
	insights: JupiterInsight[];
	isLoading: boolean;
}

const normalizeLocale = (language: string): 'en' | 'pt' =>
	language.startsWith('pt') ? 'pt' : 'en';

export const useJupiterInsights = ({
	billingReadiness,
	hasAvailability,
	metrics,
	patientCount,
	weekStart,
	whatsappRemindersEnabled,
}: UseJupiterInsightsInput): UseJupiterInsightsReturn => {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const locale = normalizeLocale(i18n.language);

	const { data, isLoading } = useQuery({
		queryFn: () => getJupiterInsights(locale),
		queryKey: ['jupiter-insights', locale],
		staleTime: 5 * 60 * 1000,
	});

	return useMemo(() => {
		const { todayBookedCount, weekBusiestDay, weekBookedCount, weekCancelledCount } = metrics;
		const weekHref = `../${AVAILABILITYWEEK_BASE}/${weekStart}`;

		const tier: InsightTier = !hasAvailability
			? 'onboarding'
			: patientCount < 5
			? 'growing'
			: 'active';

		const k = (key: string) => `page.dashboard.widgets.jupiter-insights.${key}`;

		const categoryLabel = (category: BeInsightCategory): string => {
			const map: Record<BeInsightCategory, string> = {
				'daily-briefing': t(k('category-daily-briefing')),
				growth: t(k('category-growth')),
				operations: t(k('category-operations')),
				'patient-care': t(k('category-patient-care')),
				schedule: t(k('category-schedule')),
				setup: t(k('category-setup')),
			};
			return map[category];
		};

		const getTargetHref = (target: BeInsightActionTarget): string => {
			switch (target.type) {
				case 'availability-week':
					return target.date
						? `../${AVAILABILITYWEEK_BASE}/${target.date}`
						: `../${AVAILABILITYWEEK_BASE}`;
				case 'availability-wizard':
					return `../${AVAILABILITYWIZARD}`;
				case 'notification-settings':
					return `../${NOTIFICATIONSETTINGS}`;
				case 'patient-profile':
					return `../${PATIENTPROFILE.replace(':patientId', target.patientId)}`;
				case 'patients':
					return `../${PATIENTS}`;
			}
		};

		const mapBackendItem = (item: BeInsightItem): JupiterInsight => ({
			actionLabel: item.action ? t(item.action.labelKey) : undefined,
			actionTarget: item.action?.target.type,
			category: categoryLabel(item.category),
			id: item.id,
			insightType: item.insightType,
			onAction: item.action
				? () => navigate(getTargetHref(item.action!.target))
				: undefined,
			source: item.source,
			text: item.text,
			tier: item.tier,
		});

		const mapBackendResponse = (
			response: BeJupiterInsightsResponse
		): JupiterInsight[] => [
			{
				category: categoryLabel(response.summary.category),
				id: response.summary.id,
				insightType: 'dashboard-summary',
				source: response.summary.source,
				text: response.summary.text,
			},
			...response.insights.map(mapBackendItem),
		];

		const getBillingReadinessInsight = (): JupiterInsight | undefined => {
			if (billingReadiness.totalCount === 0 || tier === 'onboarding') {
				return undefined;
			}

			const isBillingReady = billingReadiness.status === 'ready';

			return {
				actionLabel: isBillingReady ? undefined : t(k('action-review-patients')),
				actionTarget: isBillingReady ? undefined : 'patients',
				category: t(k('category-operations')),
				id: isBillingReady ? 'billing-readiness-ready' : 'billing-readiness',
				insightType: 'billing-readiness',
				onAction: isBillingReady ? undefined : () => navigate(`../${PATIENTS}`),
				source: 'fallback',
				text: isBillingReady
					? t(k('text-billing-readiness-ready'))
					: t(k('text-billing-readiness-incomplete'), {
							missing: billingReadiness.missingCount,
						}),
				tier,
			};
		};

		const withBillingInsight = (
			insights: JupiterInsight[]
		): JupiterInsight[] => {
			if (insights.some((insight) => insight.insightType === 'billing-readiness')) {
				return insights;
			}

			const billingInsight = getBillingReadinessInsight();
			return billingInsight ? [...insights, billingInsight] : insights;
		};

		if (data) {
			return {
				insights: withBillingInsight(mapBackendResponse(data)),
				isLoading,
			};
		}

		const feInsights: JupiterInsight[] = [];

		if (!hasAvailability) {
			feInsights.push({
				actionLabel: t(k('action-setup-availability')),
				category: t(k('category-setup')),
				id: 'setup-availability',
				insightType: 'setup-availability',
				onAction: () => navigate(`../${AVAILABILITYWIZARD}`),
				source: 'fallback',
				text: t(k('text-setup-availability')),
				tier: 'onboarding',
			});
		}

		if (hasAvailability && patientCount === 0) {
			feInsights.push({
				category: t(k('category-growth')),
				id: 'no-patients-yet',
				insightType: 'no-patients-yet',
				source: 'fallback',
				text: t(k('text-no-patients-yet')),
				tier: 'onboarding',
			});
		}

		if (tier !== 'onboarding') {
			const noSessionsText =
				weekBookedCount > 0
					? t(k('text-session-none-today-week'), { count: weekBookedCount })
					: t(k('text-session-none-today'));

			feInsights.push({
				actionLabel:
					todayBookedCount === 0 && weekBookedCount > 0
						? t(k('action-view-schedule'))
						: undefined,
				category: t(k('category-schedule')),
				id: 'session-count-today',
				insightType: 'session-count-today',
				onAction:
					todayBookedCount === 0 && weekBookedCount > 0
						? () => navigate(weekHref)
						: undefined,
				source: 'fallback',
				text:
					todayBookedCount === 0
						? noSessionsText
						: t(k('text-session-count-today'), { count: todayBookedCount }),
				tier,
			});
		}

		if (tier === 'active' && weekCancelledCount >= 2) {
			feInsights.push({
				actionLabel: t(k('action-view-patients')),
				category: t(k('category-patient-care')),
				id: 'week-cancellations',
				insightType: 'week-cancellations',
				onAction: () => navigate(`../${PATIENTS}`),
				source: 'fallback',
				text: t(k('text-week-cancellations'), { count: weekCancelledCount }),
				tier: 'active',
			});
		}

		if (tier === 'growing' && weekBookedCount <= 2) {
			feInsights.push({
				actionLabel: t(k('action-availability')),
				category: t(k('category-schedule')),
				id: 'low-week-volume',
				insightType: 'low-week-volume',
				onAction: () => navigate(weekHref),
				source: 'fallback',
				text: t(k('text-low-week-volume'), { count: weekBookedCount }),
				tier: 'growing',
			});
		}

		if (tier === 'active' && weekBusiestDay.count >= 3 && weekBusiestDay.date) {
			feInsights.push({
				actionLabel: t(k('action-view-schedule')),
				category: t(k('category-schedule')),
				id: 'busy-day-pattern',
				insightType: 'busy-day-pattern',
				onAction: () => navigate(weekHref),
				source: 'fallback',
				text: t(k('text-busy-day'), {
					day: format(parseISO(weekBusiestDay.date), 'EEEE'),
				}),
				tier: 'active',
			});
		}

		if (!whatsappRemindersEnabled && tier !== 'onboarding') {
			feInsights.push({
				actionLabel: t(k('action-set-up-reminders')),
				category: t(k('category-setup')),
				id: 'whatsapp-reminders',
				insightType: 'whatsapp-reminders-off',
				onAction: () => navigate(`../${NOTIFICATIONSETTINGS}`),
				source: 'fallback',
				text: t(k('text-whatsapp-reminders')),
				tier,
			});
		}

		const billingInsight = getBillingReadinessInsight();
		if (billingInsight) feInsights.push(billingInsight);

		if ((PATIENT_MILESTONES as readonly number[]).includes(patientCount) && patientCount > 0) {
			feInsights.push({
				category: t(k('category-insights')),
				id: `patient-milestone-${patientCount}`,
				insightType: 'patient-milestone',
				source: 'fallback',
				text: t(k('text-patient-milestone'), { count: patientCount }),
				tier,
			});
		}

		return {
			insights: [
				{
					category: t(k('category-daily-briefing')),
					id: 'dashboard-summary-fallback',
					insightType: 'dashboard-summary',
					source: 'fallback',
					text: t(k('text-dashboard-summary-fallback'), {
						count: weekBookedCount,
					}),
				},
				...feInsights.slice(0, MAX_INSIGHTS),
			],
			isLoading,
		};
	}, [
		billingReadiness,
		data,
		hasAvailability,
		isLoading,
		metrics,
		navigate,
		patientCount,
		t,
		weekStart,
		whatsappRemindersEnabled,
	]);
};
