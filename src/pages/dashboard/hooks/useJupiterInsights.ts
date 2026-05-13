import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { type BeInsightItem, getJupiterInsights } from '@psycron/api/jupiter';
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
	hasAvailability: boolean;
	metrics: WeekMetrics;
	patientCount: number;
	weekStart: string;
	whatsappRemindersEnabled?: boolean;
}

export const useJupiterInsights = ({
	hasAvailability,
	metrics,
	patientCount,
	weekStart,
	whatsappRemindersEnabled,
}: UseJupiterInsightsInput): JupiterInsight[] => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const { data: beItems = [] } = useQuery({
		queryFn: getJupiterInsights,
		queryKey: ['jupiter-insights'],
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

		const mapBeItem = (item: BeInsightItem): JupiterInsight => {
			const { meta } = item;
			const patientName = meta?.patientFirstName ?? '';
			const profilePath = PATIENTPROFILE.replace(':patientId', meta?.patientId ?? '');

			switch (item.insightType) {
				case 'missed-rebooking':
					return {
						actionLabel: t(k('action-send-message')),
						category: t(k('category-patient-care')),
						id: item.id,
						insightType: 'missed-rebooking',
						onAction: () => navigate(`../${profilePath}`),
						onSecondaryAction: () => navigate(`../${profilePath}`),
						secondaryActionLabel: t(k('action-view-profile')),
						text: t(k('text-missed-rebooking'), { name: patientName }),
						tier: item.tier,
					};
				case 'setup-availability':
					return {
						actionLabel: t(k('action-setup-availability')),
						category: t(k('category-setup')),
						id: item.id,
						insightType: 'setup-availability',
						onAction: () => navigate(`../${AVAILABILITYWIZARD}`),
						text: t(k('text-setup-availability')),
						tier: item.tier,
					};
				case 'no-patients-yet':
					return {
						category: t(k('category-growth')),
						id: item.id,
						insightType: 'no-patients-yet',
						text: t(k('text-no-patients-yet')),
						tier: item.tier,
					};
			}
		};

		const beInsights = beItems.map(mapBeItem);
		const beInsightTypes = new Set(beItems.map((i) => i.insightType));

		const feInsights: JupiterInsight[] = [];

		if (!beInsightTypes.has('setup-availability') && !hasAvailability) {
			feInsights.push({
				actionLabel: t(k('action-setup-availability')),
				category: t(k('category-setup')),
				id: 'setup-availability',
				insightType: 'setup-availability',
				onAction: () => navigate(`../${AVAILABILITYWIZARD}`),
				text: t(k('text-setup-availability')),
				tier: 'onboarding',
			});
		}

		if (!beInsightTypes.has('no-patients-yet') && hasAvailability && patientCount === 0) {
			feInsights.push({
				category: t(k('category-growth')),
				id: 'no-patients-yet',
				insightType: 'no-patients-yet',
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
				text: t(k('text-whatsapp-reminders')),
				tier,
			});
		}

		if ((PATIENT_MILESTONES as readonly number[]).includes(patientCount) && patientCount > 0) {
			feInsights.push({
				category: t(k('category-insights')),
				id: `patient-milestone-${patientCount}`,
				insightType: 'patient-milestone',
				text: t(k('text-patient-milestone'), { count: patientCount }),
				tier,
			});
		}

		return [...beInsights, ...feInsights].slice(0, MAX_INSIGHTS);
	}, [
		beItems,
		hasAvailability,
		metrics,
		navigate,
		patientCount,
		t,
		weekStart,
		whatsappRemindersEnabled,
	]);
};
