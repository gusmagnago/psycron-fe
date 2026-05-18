import { useCallback, useMemo, useState } from 'react';
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
import type { DashboardActionTarget } from '@psycron/api/dashboard/index.types';
import { BentoTile } from '@psycron/components/dashboard/bento-tile/BentoTile';
import { CustomizeControl } from '@psycron/components/dashboard/customize-control/CustomizeControl';
import { ActionCenterWidget } from '@psycron/components/dashboard/widgets/action-center-widget/ActionCenterWidget';
import { BillingReadinessWidget } from '@psycron/components/dashboard/widgets/billing-readiness-widget/BillingReadinessWidget';
import { GreetingWidget } from '@psycron/components/dashboard/widgets/greeting-widget/GreetingWidget';
import { JupiterInsightsWidget } from '@psycron/components/dashboard/widgets/jupiter-insights-widget/JupiterInsightsWidget';
import { NotificationsWidget } from '@psycron/components/dashboard/widgets/notifications-widget/NotificationsWidget';
import { PendingTasksWidget } from '@psycron/components/dashboard/widgets/pending-tasks-widget/PendingTasksWidget';
import type { PendingTask } from '@psycron/components/dashboard/widgets/pending-tasks-widget/PendingTasksWidget.types';
import { QuickActionsWidget } from '@psycron/components/dashboard/widgets/quick-actions-widget/QuickActionsWidget';
import { getActionTone } from '@psycron/components/dashboard/widgets/quick-actions-widget/QuickActionsWidget.utils';
import { RecentPatientsWidget } from '@psycron/components/dashboard/widgets/recent-patients-widget/RecentPatientsWidget';
import type { RecentPatient } from '@psycron/components/dashboard/widgets/recent-patients-widget/RecentPatientsWidget.types';
import { RevenueWidget } from '@psycron/components/dashboard/widgets/revenue-widget/RevenueWidget';
import { ScheduleWidget } from '@psycron/components/dashboard/widgets/schedule-widget/ScheduleWidget';
import { SessionAnalyticsWidget } from '@psycron/components/dashboard/widgets/session-analytics-widget/SessionAnalyticsWidget';
import type { WeeklyBarData } from '@psycron/components/dashboard/widgets/weekly-chart-widget/WeeklyChartWidget.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useTimeOfDay } from '@psycron/hooks/useTimeOfDay';
import useViewport from '@psycron/hooks/useViewport';
import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import { AvailabilityWeekDrawer } from '@psycron/pages/availability/week/drawer/AvailabilityWeekDrawer';
import {
	AVAILABILITYWEEK_BASE,
	PATIENTPROFILE,
	PATIENTS,
} from '@psycron/pages/urls';

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
	getWidgetInfoId,
	MAX_TILE_COL_SPAN,
	MAX_TILE_ROW_SPAN,
	MIN_TILE_ROW_SPAN,
	TILE_DESKTOP,
	TILE_MIN_HEIGHT,
	TILE_TABLET,
} from './Dashboard.utils';

export const Dashboard = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { userDetails } = useUserDetails();
	const band = useTimeOfDay();
	const { isMobile, isBiggerThanTablet } = useViewport();
	const {
		isLoading,
		metrics,
		timezone,
		todaySlots,
		weekEnd,
		weekSlotsByDay,
		weekStart,
	} = useDashboardSlots();
	const { isLoading: isSummaryLoading, summary } = useDashboardSummary();
	const billingReadiness = summary?.billingReadiness;
	const {
		isCustomizing,
		layout,
		organizeLayout,
		reorderLayout,
		resizeTile,
		resizeTileWidth,
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

	const navigateToDashboardTarget = useCallback(
		(target: DashboardActionTarget) => {
			const { state, to } = getTargetNav(target);
			navigate(to, { state });
		},
		[navigate]
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
		summary?.setup.hasAvailability ??
		(userDetails?.availability?.length ?? 0) > 0;
	const whatsappRemindersEnabled =
		summary?.setup.remindersEnabled ??
		userDetails?.notificationPreferences?.reminder?.whatsapp;

	const { insights: jupiterInsights, isLoading: isJupiterInsightsLoading } =
		useJupiterInsights({
			billingReadiness: billingReadiness ?? {
				configuredCount: 0,
				missingCount: 0,
				percentage: 0,
				status: 'empty',
				totalCount: 0,
			},
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
				description: action.descriptionKey
					? t(action.descriptionKey, action.descriptionValues)
					: undefined,
				onClick: () => {
					capture(PostHogEvent.DashboardQuickActionClicked, {
						action_id: action.id,
						source: 'dashboard-summary',
						tier: summary?.tier ?? 'unknown',
						tile_id: 'quick-actions',
					});
					navigateToDashboardTarget(action.target);
				},
				tier: summary?.tier ?? 'onboarding',
				tone: getActionTone(action.id),
			})),
		[navigateToDashboardTarget, summary?.quickActions, summary?.tier, t]
	);

	const pendingTasks = useMemo<PendingTask[]>(
		() =>
			(summary?.pendingTasks ?? []).map((task) => ({
				count: task.count,
				description: task.descriptionKey
					? t(task.descriptionKey, task.descriptionValues)
					: undefined,
				label: t(task.labelKey),
				onClick: () => {
					capture(PostHogEvent.DashboardPendingTaskClicked, {
						count: task.count,
						source: 'dashboard-summary',
						task_type: task.type,
						tier: summary?.tier ?? 'unknown',
						tile_id: 'pending-tasks',
					});
					navigateToDashboardTarget(task.target);
				},
				tier: summary?.tier ?? 'onboarding',
				type: task.type,
			})),
		[navigateToDashboardTarget, summary?.pendingTasks, summary?.tier, t]
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
					? () =>
							navigate(`../${PATIENTPROFILE.replace(':patientId', patient.id)}`)
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
		const minRow = baseSpan.minRow ?? MIN_TILE_ROW_SPAN;
		const minCol = baseSpan.minCol ?? 1;
		const row = Math.min(
			Math.max(baseSpan.row + (tile?.heightDelta ?? 0), minRow),
			MAX_TILE_ROW_SPAN
		);
		const col = Math.min(
			Math.max(baseSpan.col + (tile?.colDelta ?? 0), minCol),
			MAX_TILE_COL_SPAN
		);
		return { ...baseSpan, col, row };
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
			onResizeWidth: resizeTileWidth,
			onToggleVisibility: toggleVisibility,
			orientation,
			rowSpan: row,
			tier: summary?.tier,
			widgetInfoId: getWidgetInfoId(tileId),
		};

		switch (tileId) {
			case 'greeting':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<GreetingWidget band={band} name={userDetails?.firstName ?? ''} />
					</BentoTile>
				);

			case 'schedule':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<ScheduleWidget
							isLoading={isLoading}
							onSlotClick={(slot) => {
								capture(PostHogEvent.DashboardScheduleSlotClicked, {
									date: slot.date,
									tier: summary?.tier ?? 'unknown',
									tile_id: 'schedule',
								});
								setSelectedSlot(slot);
							}}
							slots={todaySlots}
							timezone={timezone}
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
							colSpan={col}
							isLoading={isSummaryLoading}
						/>
					</BentoTile>
				);

			case 'billing-readiness':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<BillingReadinessWidget
							colSpan={col}
							configuredCount={billingReadiness?.configuredCount ?? 0}
							isLoading={isSummaryLoading}
							missingCount={billingReadiness?.missingCount ?? 0}
							onClick={() => {
								capture(PostHogEvent.DashboardBillingReadinessClicked, {
									percentage: billingReadiness?.percentage ?? 0,
									source: 'dashboard-summary',
									tier: summary?.tier ?? 'unknown',
									tile_id: 'billing-readiness',
								});
								navigate(`../${PATIENTS}`);
							}}
							percentage={billingReadiness?.percentage ?? 0}
							status={billingReadiness?.status ?? 'empty'}
							totalCount={billingReadiness?.totalCount ?? 0}
						/>
					</BentoTile>
				);

			case 'revenue':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<RevenueWidget
							colSpan={col}
							estimate={summary?.revenueEstimate}
							isLoading={isSummaryLoading}
							onClick={() => navigate(`../${PATIENTS}`)}
						/>
					</BentoTile>
				);

			case 'notifications':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<NotificationsWidget
							colSpan={col}
							isLoading={isSummaryLoading}
							onStatusClick={(status) => {
								if (status) {
									capture(PostHogEvent.DashboardNotificationStatusClicked, {
										status: status as 'FAILED' | 'PENDING' | 'SENT',
										tier: summary?.tier ?? 'unknown',
									});
								}
								navigateToDashboardTarget({ status, type: 'notifications' });
							}}
							onViewFeed={() =>
								navigateToDashboardTarget({ type: 'notifications' })
							}
							summary={summary?.notifications24h}
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
								upcoming:
									summary?.week.upcomingCount ?? metrics.weekUpcomingCount,
							}}
						/>
					</BentoTile>
				);
			}

			case 'pending-tasks':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<PendingTasksWidget
							colSpan={col}
							isLoading={isSummaryLoading}
							tasks={pendingTasks}
						/>
					</BentoTile>
				);

			case 'action-center':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<ActionCenterWidget
							isLoading={isSummaryLoading}
							summary={summary?.actionCenter}
						/>
					</BentoTile>
				);

			case 'recent-patients':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<RecentPatientsWidget
							colSpan={col}
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
		<>
			<DashboardRoot>
				<DashboardTopBar>
					<CustomizeControl
						isCustomizing={isCustomizing}
						onOrganize={organizeLayout}
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
		</>
	);
};
