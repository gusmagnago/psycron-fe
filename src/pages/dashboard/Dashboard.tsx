import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { BentoTile } from '@psycron/components/dashboard/bento-tile/BentoTile';
import { CustomizeControl } from '@psycron/components/dashboard/customize-control/CustomizeControl';
import { DashboardGreeting } from '@psycron/components/dashboard/greeting/DashboardGreeting';
import { BillingReadinessWidget } from '@psycron/components/dashboard/widgets/billing-readiness-widget/BillingReadinessWidget';
import { JupiterInsightsWidget } from '@psycron/components/dashboard/widgets/jupiter-insights-widget/JupiterInsightsWidget';
import { PendingTasksWidget } from '@psycron/components/dashboard/widgets/pending-tasks-widget/PendingTasksWidget';
import type { PendingTask } from '@psycron/components/dashboard/widgets/pending-tasks-widget/PendingTasksWidget.types';
import { QuickActionsWidget } from '@psycron/components/dashboard/widgets/quick-actions-widget/QuickActionsWidget';
import { RecentPatientsWidget } from '@psycron/components/dashboard/widgets/recent-patients-widget/RecentPatientsWidget';
import type { RecentPatient } from '@psycron/components/dashboard/widgets/recent-patients-widget/RecentPatientsWidget.types';
import { ScheduleWidget } from '@psycron/components/dashboard/widgets/schedule-widget/ScheduleWidget';
import { SessionAnalyticsWidget } from '@psycron/components/dashboard/widgets/session-analytics-widget/SessionAnalyticsWidget';
import type { WeeklyBarData } from '@psycron/components/dashboard/widgets/weekly-chart-widget/WeeklyChartWidget.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useTimeOfDay } from '@psycron/hooks/useTimeOfDay';
import useViewport from '@psycron/hooks/useViewport';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import { AvailabilityWeekDrawer } from '@psycron/pages/availability/week/drawer/AvailabilityWeekDrawer';
import { AVAILABILITYWEEK_BASE, PATIENTPROFILE, PATIENTS } from '@psycron/pages/urls';

import { useDashboardBillingReadiness } from './hooks/useDashboardBillingReadiness';
import { useDashboardLayout } from './hooks/useDashboardLayout';
import { useDashboardSlots } from './hooks/useDashboardSlots';
import { useDashboardSummary } from './hooks/useDashboardSummary';
import { useJupiterInsights } from './hooks/useJupiterInsights';
import {
	BentoGrid,
	BentoGridWrapper,
	DashboardRoot,
	DashboardTopBar,
	DragOverlayCard,
} from './Dashboard.styles';
import type { DashboardTileId } from './Dashboard.types';
import {
	getQuickActionIcon,
	getTargetNav,
	MAX_TILE_ROW_SPAN,
	MIN_TILE_ROW_SPAN,
	TILE_DESKTOP,
	TILE_MIN_HEIGHT,
	TILE_TABLET,
} from './Dashboard.utils';
import { DashboardDevGrid } from './DashboardDevGrid';

export const Dashboard = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { userDetails } = useUserDetails();
	const band = useTimeOfDay();
	const { isMobile, isBiggerThanTablet } = useViewport();
	const { isLoading, metrics, todaySlots, weekEnd, weekSlotsByDay, weekStart } =
		useDashboardSlots();
	const { isLoading: isSummaryLoading, summary } = useDashboardSummary();
	const {
		billingReadiness,
		isLoading: isBillingReadinessLoading,
	} = useDashboardBillingReadiness(summary?.billingReadiness);
	const {
		isCustomizing,
		layout,
		reorderLayout,
		resizeTile,
		resetLayout,
		setCustomizing,
		toggleTileOrientation,
		toggleVisibility,
	} = useDashboardLayout();

	const [activeId, setActiveId] = useState<DashboardTileId | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<IWeekSlot | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const sortedLayout = useMemo(
		() => [...layout].sort((a, b) => a.order - b.order),
		[layout]
	);

	const sortedIds = useMemo(
		() => sortedLayout.map((t) => t.id),
		[sortedLayout]
	);

	const handleDragStart = ({ active }: DragStartEvent) => {
		setActiveId(active.id as DashboardTileId);
	};

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (over && active.id !== over.id) {
			const fromIdx = sortedIds.indexOf(active.id as DashboardTileId);
			const toIdx = sortedIds.indexOf(over.id as DashboardTileId);
			reorderLayout(active.id as DashboardTileId, over.id as DashboardTileId);
			capture(PostHogEvent.DashboardTileReordered, {
				from_index: fromIdx,
				tile_id: active.id as string,
				to_index: toIdx,
			});
		}
		setActiveId(null);
	};

	const weeklyChartData = useMemo<WeeklyBarData[]>(
		() => summary?.weeklySeries ?? [],
		[summary?.weeklySeries]
	);

	const monthlyChartData = useMemo<WeeklyBarData[]>(
		() => summary?.monthlySeries ?? [],
		[summary?.monthlySeries]
	);

	const monthMetrics = summary?.month;

	const patientCount =
		summary?.activePatients.count ?? userDetails?.patients?.length ?? 0;
	const hasAvailability =
		summary?.setup.hasAvailability ?? (userDetails?.availability?.length ?? 0) > 0;
	const whatsappRemindersEnabled =
		summary?.setup.remindersEnabled ??
		userDetails?.notificationPreferences?.reminder?.whatsapp;

	const { insights: jupiterInsights, isLoading: isJupiterInsightsLoading } =
		useJupiterInsights({
			billingReadiness,
			hasAvailability,
			metrics,
			patientCount,
			weekStart,
			whatsappRemindersEnabled,
		});

	const quickActions = useMemo(
		() =>
			(summary?.quickActions ?? []).map((action) => ({
				ariaLabel: t(action.labelKey),
				icon: getQuickActionIcon(action.id),
				id: action.id,
				label: t(action.labelKey),
				onClick: () => {
					capture(PostHogEvent.DashboardQuickActionClicked, {
						action_id: action.id,
						source: 'dashboard-summary',
						tier: summary?.tier ?? 'unknown',
						tile_id: 'quick-actions',
					});
					const { state, to } = getTargetNav(action.target);
					navigate(to, { state });
				},
				tier: summary?.tier ?? 'onboarding',
			})),
		[navigate, summary?.quickActions, summary?.tier, t]
	);

	const pendingTasks = useMemo<PendingTask[]>(
		() =>
			(summary?.pendingTasks ?? []).map((task) => ({
				count: task.count,
				label: t(task.labelKey),
				onClick: () => {
					capture(PostHogEvent.DashboardPendingTaskClicked, {
						count: task.count,
						source: 'dashboard-summary',
						task_type: task.type,
						tier: summary?.tier ?? 'unknown',
						tile_id: 'pending-tasks',
					});
					const { state, to } = getTargetNav(task.target);
					navigate(to, { state });
				},
				tier: summary?.tier ?? 'onboarding',
				type: task.type,
			})),
		[navigate, summary?.pendingTasks, summary?.tier, t]
	);

	const recentPatients = useMemo<RecentPatient[]>(
		() =>
			(summary?.recentPatients ?? []).map((patient) => ({
				firstName: patient.firstName,
				id: patient.id,
				lastActivityAt: patient.lastActivityAt,
				lastActivityType: patient.lastActivityType,
				lastName: patient.lastName,
				onMessage: patient.hasMessageContact
					? () => navigate(`../${PATIENTPROFILE.replace(':patientId', patient.id)}`)
					: undefined,
				onOpen: () => {
					capture(PostHogEvent.DashboardRecentPatientOpened, {
						patient_id: patient.id,
						source: 'dashboard-summary',
						tier: summary?.tier ?? 'unknown',
						tile_id: 'recent-patients',
					});
					navigate(`../${PATIENTPROFILE.replace(':patientId', patient.id)}`);
				},
				tier: summary?.tier ?? 'onboarding',
			})),
		[navigate, summary?.recentPatients, summary?.tier]
	);

	const getSpan = (id: DashboardTileId) => {
		if (isMobile) return { col: 1, row: 1 };
		const baseSpan = isBiggerThanTablet ? TILE_DESKTOP[id] : TILE_TABLET[id];
		const tile = layout.find((t) => t.id === id);
		const row = Math.min(
			Math.max(baseSpan.row + (tile?.heightDelta ?? 0), MIN_TILE_ROW_SPAN),
			MAX_TILE_ROW_SPAN
		);
		return { ...baseSpan, row };
	};

	const renderTile = (tileId: DashboardTileId, index: number) => {
		const tile = layout.find((t) => t.id === tileId);
		const { col, row } = getSpan(tileId);
		const orientation =
			tileId === 'session-analytics'
				? (tile?.orientation ?? (row >= 4 ? 'column' : 'row'))
				: tile?.orientation;

		const commonProps = {
			ariaLabel: t(`page.dashboard.tiles.${tileId}`),
			colSpan: col,
			id: tileId,
			index,
			isEditMode: isCustomizing,
			isHidden: !(tile?.visible ?? true),
			onToggleOrientation:
				tileId === 'session-analytics' ? toggleTileOrientation : undefined,
			onResize: resizeTile,
			onToggleVisibility: toggleVisibility,
			orientation,
			rowSpan: row,
		};

		switch (tileId) {
			case 'schedule':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<ScheduleWidget
							isLoading={isLoading}
							onSlotClick={setSelectedSlot}
							slots={todaySlots}
							weekEnd={weekEnd}
							weekHref={`${AVAILABILITYWEEK_BASE}/${weekStart}`}
							weekSlotsByDay={weekSlotsByDay}
							weekStart={weekStart}
						/>
					</BentoTile>
				);

			case 'jupiter-insights':
				return (
					<BentoTile {...commonProps} key={tileId} variant='jupiter'>
						<JupiterInsightsWidget
							insights={jupiterInsights}
							isLoading={isLoading || isJupiterInsightsLoading}
						/>
					</BentoTile>
				);

			case 'quick-actions':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<QuickActionsWidget
							actions={quickActions}
							isLoading={isSummaryLoading}
						/>
					</BentoTile>
				);

			case 'billing-readiness':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<BillingReadinessWidget
							configuredCount={billingReadiness.configuredCount}
							isLoading={isSummaryLoading || isBillingReadinessLoading}
							missingCount={billingReadiness.missingCount}
							onClick={() => {
								capture(PostHogEvent.DashboardBillingReadinessClicked, {
									percentage: billingReadiness.percentage,
									source: 'dashboard-summary',
									tier: summary?.tier ?? 'unknown',
									tile_id: 'billing-readiness',
								});
								navigate(`../${PATIENTS}`);
							}}
							percentage={billingReadiness.percentage}
							status={billingReadiness.status}
							totalCount={billingReadiness.totalCount}
						/>
					</BentoTile>
				);

			case 'session-analytics': {
				const { row: sessionAnalyticsRowSpan } = getSpan('session-analytics');
				return (
					<BentoTile {...commonProps} key={tileId}>
						<SessionAnalyticsWidget
							chartData={weeklyChartData}
							isLoading={isSummaryLoading}
							monthChartData={monthlyChartData}
							monthData={{
								adminBlockedMinutes: monthMetrics?.adminBlockedMinutes ?? 0,
								blocked: monthMetrics?.adminBlockedSlots ?? 0,
								cancelled: monthMetrics?.cancelledCount ?? 0,
								completed: monthMetrics?.completedCount ?? 0,
								upcoming: monthMetrics?.upcomingCount ?? 0,
							}}
							onDayClick={(day) => {
								capture(PostHogEvent.DashboardChartDayClicked, {
									date: day.date,
									source: 'dashboard-summary',
									tier: summary?.tier ?? 'unknown',
									tile_id: 'session-analytics',
								});
								navigate(`../${AVAILABILITYWEEK_BASE}/${day.date}`);
							}}
							onViewModeChange={(mode) => {
								capture(PostHogEvent.DashboardSessionAnalyticsViewToggled, {
									source: 'dashboard-summary',
									tier: summary?.tier ?? 'unknown',
									tile_id: 'session-analytics',
									view_mode: mode,
								});
							}}
							layout={orientation ?? 'row'}
							rowSpan={sessionAnalyticsRowSpan}
							weekData={{
								adminBlockedMinutes: summary?.week.adminBlockedMinutes ?? 0,
								blocked: summary?.week.adminBlockedSlots ?? 0,
								cancelled:
									summary?.week.cancelledCount ?? metrics.weekCancelledCount,
								completed:
									summary?.week.completedCount ?? metrics.weekCompletedCount,
								upcoming: summary?.week.upcomingCount ?? metrics.weekUpcomingCount,
							}}
						/>
					</BentoTile>
				);
			}

			case 'pending-tasks':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<PendingTasksWidget
							isLoading={isSummaryLoading}
							tasks={pendingTasks}
						/>
					</BentoTile>
				);

			case 'recent-patients':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<RecentPatientsWidget
							isLoading={isSummaryLoading && recentPatients.length === 0}
							onViewAll={() => navigate(`../${PATIENTS}`)}
							patients={recentPatients}
						/>
					</BentoTile>
				);

			default:
				return null;
		}
	};

	const activeSpan = activeId ? getSpan(activeId) : null;

	return (
		<PageLayout isLoading={false} title={t('page.dashboard.title')}>
			<DashboardRoot>
				<DashboardTopBar>
					<DashboardGreeting band={band} name={userDetails?.firstName ?? ''} />
					<CustomizeControl
						isCustomizing={isCustomizing}
						onReset={resetLayout}
						onToggle={setCustomizing}
					/>
				</DashboardTopBar>

				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
					onDragStart={handleDragStart}
					sensors={sensors}
				>
					<SortableContext items={sortedIds} strategy={rectSortingStrategy}>
						<BentoGridWrapper>
							<DashboardDevGrid />
							<BentoGrid>
								{sortedLayout.map((tile, index) => renderTile(tile.id, index))}
							</BentoGrid>
						</BentoGridWrapper>
					</SortableContext>

					<DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
						{activeId && activeSpan ? (
							<DragOverlayCard
								style={{
									gridColumn: `span ${activeSpan.col}`,
									minHeight: TILE_MIN_HEIGHT[activeId],
								}}
							/>
						) : null}
					</DragOverlay>
				</DndContext>
			</DashboardRoot>

			{selectedSlot && (
				<AvailabilityWeekDrawer
					onClose={() => setSelectedSlot(null)}
					slot={selectedSlot}
				/>
			)}
		</PageLayout>
	);
};
