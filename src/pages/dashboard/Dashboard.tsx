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
import { ActionCenterWidget } from '@psycron/components/dashboard/widgets/action-center-widget/ActionCenterWidget';
import { GlanceCalendarIcon } from '@psycron/components/dashboard/widgets/glance-widget/GlanceCalendarIcon';
import { GlanceWidget } from '@psycron/components/dashboard/widgets/glance-widget/GlanceWidget';
import type { GlanceStat } from '@psycron/components/dashboard/widgets/glance-widget/GlanceWidget.types';
import { getNextBookedSlot } from '@psycron/components/dashboard/widgets/glance-widget/GlanceWidget.utils';
import { GreetingWidget } from '@psycron/components/dashboard/widgets/greeting-widget/GreetingWidget';
import { NotificationsWidget } from '@psycron/components/dashboard/widgets/notifications-widget/NotificationsWidget';
import { PendingTasksWidget } from '@psycron/components/dashboard/widgets/pending-tasks-widget/PendingTasksWidget';
import type { PendingTask } from '@psycron/components/dashboard/widgets/pending-tasks-widget/PendingTasksWidget.types';
import { PracticeReadinessWidget } from '@psycron/components/dashboard/widgets/practice-readiness-widget/PracticeReadinessWidget';
import { QuickActionsWidget } from '@psycron/components/dashboard/widgets/quick-actions-widget/QuickActionsWidget';
import { getActionTone } from '@psycron/components/dashboard/widgets/quick-actions-widget/QuickActionsWidget.utils';
import { RecentPatientsWidget } from '@psycron/components/dashboard/widgets/recent-patients-widget/RecentPatientsWidget';
import type { RecentPatient } from '@psycron/components/dashboard/widgets/recent-patients-widget/RecentPatientsWidget.types';
import { RevenueWidget } from '@psycron/components/dashboard/widgets/revenue-widget/RevenueWidget';
import { ScheduleWidget } from '@psycron/components/dashboard/widgets/schedule-widget/ScheduleWidget';
import { SessionAnalyticsWidget } from '@psycron/components/dashboard/widgets/session-analytics-widget/SessionAnalyticsWidget';
import type { WeeklyBarData } from '@psycron/components/dashboard/widgets/weekly-chart-widget/WeeklyChartWidget.types';
import { AlarmClock, TriangleAlert } from '@psycron/components/icons';
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
import { format, parseISO } from 'date-fns';

import { useDashboardLayout } from './hooks/useDashboardLayout';
import { useDashboardSlots } from './hooks/useDashboardSlots';
import { useDashboardSummary } from './hooks/useDashboardSummary';
import { useJupiterInsights } from './hooks/useJupiterInsights';
import {
	BentoGrid,
	BentoGridWrapper,
	DashboardRoot,
	DashboardSection,
	DashboardSectionLabel,
	DashboardSections,
	DragOverlayCard,
} from './Dashboard.styles';
import type { DashboardTileId } from './Dashboard.types';
import {
	getFixedTileSpan,
	getQuickActionIcon,
	getTargetNav,
	MAX_TILE_COL_SPAN,
	MAX_TILE_COL_SPAN_BY_ID,
	MAX_TILE_ROW_SPAN,
	MAX_TILE_ROW_SPAN_BY_ID,
	MIN_TILE_ROW_SPAN,
	TILE_MIN_HEIGHT,
	TILE_TABLET,
} from './Dashboard.utils';

const HERO_TILE_IDS = ['greeting', 'glance'] as const satisfies readonly DashboardTileId[];
const NEEDS_TILE_IDS = [
	'quick-actions',
	'billing-readiness',
	'action-center',
	'pending-tasks',
	'notifications',
] as const satisfies readonly DashboardTileId[];
const DAY_TILE_IDS = ['schedule'] as const satisfies readonly DashboardTileId[];
const PRACTICE_TILE_IDS = [
	'revenue',
	'session-analytics',
	'recent-patients',
] as const satisfies readonly DashboardTileId[];

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
		layout,
		reorderLayout,
		resizeTile,
		resizeTileWidth,
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

	const nextBookedSlot = useMemo(
		() => getNextBookedSlot(todaySlots),
		[todaySlots]
	);
	const todayKey = format(new Date(), 'yyyy-MM-dd');

	const attentionCount =
		summary?.actionCenter.total ??
		(summary?.pendingTasks ?? []).reduce((total, task) => total + task.count, 0);

	const glanceStats = useMemo<GlanceStat[]>(
		() => [
			{
				ariaLabel: t('page.dashboard.widgets.glance.next-session-aria', {
					value: nextBookedSlot
						? format(
								parseISO(`${nextBookedSlot.date}T${nextBookedSlot.startTime}`),
								'HH:mm'
							)
						: t('page.dashboard.widgets.glance.none'),
				}),
				icon: <AlarmClock />,
				id: 'next-session',
				label: t('page.dashboard.widgets.glance.next-session'),
				onClick: () =>
					navigateToDashboardTarget({
						date: nextBookedSlot?.date ?? todayKey,
						type: 'availability-week',
					}),
				tone: 'brand',
				value: nextBookedSlot
					? format(
							parseISO(`${nextBookedSlot.date}T${nextBookedSlot.startTime}`),
							'HH:mm'
						)
					: t('page.dashboard.widgets.glance.none'),
			},
			{
				ariaLabel: t('page.dashboard.widgets.glance.sessions-today-aria', {
					value: String(metrics.todayBookedCount),
				}),
				icon: <GlanceCalendarIcon />,
				id: 'sessions-today',
				label: t('page.dashboard.widgets.glance.sessions-today'),
				onClick: () =>
					navigateToDashboardTarget({
						date: todayKey,
						type: 'availability-week',
					}),
				tone: 'success',
				value: String(metrics.todayBookedCount),
			},
			{
				ariaLabel: t('page.dashboard.widgets.glance.needs-attention-aria', {
					value: String(attentionCount),
				}),
				icon: <TriangleAlert />,
				id: 'attention',
				label: t('page.dashboard.widgets.glance.needs-attention'),
				onClick: () =>
					navigateToDashboardTarget({ type: 'action-center' }),
				tone: attentionCount > 0 ? 'danger' : 'neutral',
				value: String(attentionCount),
			},
		],
		[
			attentionCount,
			metrics.todayBookedCount,
			nextBookedSlot,
			navigateToDashboardTarget,
			t,
			todayKey,
		]
	);

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
		const baseSpan = isBiggerThanTablet ? getFixedTileSpan(id) : TILE_TABLET[id];
		const tile = layout.find((item) => item.id === id);
		const minRow = baseSpan.minRow ?? MIN_TILE_ROW_SPAN;
		const minCol = baseSpan.minCol ?? 1;
		const maxCol = MAX_TILE_COL_SPAN_BY_ID[id] ?? MAX_TILE_COL_SPAN;
		const maxRow = MAX_TILE_ROW_SPAN_BY_ID[id] ?? MAX_TILE_ROW_SPAN;
		return {
			...baseSpan,
			col: Math.min(
				Math.max(baseSpan.col + (tile?.colDelta ?? 0), minCol),
				maxCol
			),
			row: Math.min(
				Math.max(baseSpan.row + (tile?.heightDelta ?? 0), minRow),
				maxRow
			),
		};
	};

	const renderTile = (tileId: DashboardTileId, index: number) => {
		const tile = layout.find((t) => t.id === tileId);
		const { col, row } = getSpan(tileId);
		const orientation =
			tileId === 'session-analytics'
				? row >= 4
					? 'column'
					: 'row'
				: tile?.orientation;

		const commonProps = {
			ariaLabel: t(`page.dashboard.tiles.${tileId}`),
			colSpan: col,
			id: tileId,
			index,
			isEditMode: false,
			isHidden: !(tile?.visible ?? true),
			onResize: resizeTile,
			onResizeWidth: resizeTileWidth,
			onToggleOrientation: toggleTileOrientation,
			onToggleVisibility: toggleVisibility,
			orientation,
			rowSpan: row,
			tier: summary?.tier,
		};

		switch (tileId) {
			case 'greeting':
				return (
					<BentoTile {...commonProps} key={tileId} variant='greeting'>
						<GreetingWidget
							band={band}
							insights={jupiterInsights}
							isLoading={isLoading || isJupiterInsightsLoading}
							name={userDetails?.firstName ?? ''}
							sessionCount={todaySlots?.length}
						/>
					</BentoTile>
				);

			case 'glance':
				return (
					<BentoTile {...commonProps} key={tileId} variant='glance'>
						<GlanceWidget
							isLoading={isLoading || isSummaryLoading}
							stats={glanceStats}
						/>
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

			case 'billing-readiness': {
				const missingContactCount =
					summary?.pendingTasks?.find(
						(task) => task.type === 'missing-contact'
					)?.count ?? 0;
				const contactsConfigured = Math.max(
					0,
					patientCount - missingContactCount
				);
				return (
					<BentoTile {...commonProps} key={tileId}>
						<PracticeReadinessWidget
							billingConfigured={billingReadiness?.configuredCount ?? 0}
							billingPercentage={billingReadiness?.percentage ?? 0}
							billingTotal={billingReadiness?.totalCount ?? 0}
							colSpan={col}
							contactsConfigured={contactsConfigured}
							contactsTotal={patientCount}
							hasAvailability={hasAvailability}
							isLoading={isSummaryLoading}
							onSegmentAction={(segment) => {
								capture(PostHogEvent.DashboardBillingReadinessClicked, {
									percentage: billingReadiness?.percentage ?? 0,
									source: 'dashboard-summary',
									tier: summary?.tier ?? 'unknown',
									tile_id: 'billing-readiness',
								});
								if (segment === 'availability') {
									navigateToDashboardTarget({ type: 'availability-settings' });
								} else {
									navigate(`../${PATIENTS}`);
								}
							}}
						/>
					</BentoTile>
				);
			}

			case 'revenue':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<RevenueWidget
							colSpan={col}
							estimate={summary?.revenueEstimate}
							isLoading={isSummaryLoading}
							onClick={() => navigate(`../${PATIENTS}`)}
							weekEstimate={{
								amount:
									summary?.revenueEstimate &&
									summary.revenueEstimate.completedSessionCount > 0
										? (summary.revenueEstimate.amount /
												summary.revenueEstimate.completedSessionCount) *
											(summary?.week.completedCount ??
												metrics.weekCompletedCount)
										: 0,
								cancelledCount:
									summary?.week.cancelledCount ?? metrics.weekCancelledCount,
								completedCount:
									summary?.week.completedCount ?? metrics.weekCompletedCount,
								upcomingCount:
									summary?.week.upcomingCount ?? metrics.weekUpcomingCount,
							}}
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
							onItemClick={(item) => {
								capture(PostHogEvent.DashboardActionCenterItemClicked, {
									count: item.count,
									item_type: item.type,
									tier: summary?.tier ?? 'unknown',
								});
								navigateToDashboardTarget(item.target);
							}}
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

	const renderSectionTiles = (
		tileIds: readonly DashboardTileId[],
		indexOffset = 0
	) =>
		tileIds.map((tileId, index) => renderTile(tileId, indexOffset + index));

	const getOrderedSectionTileIds = (tileIds: readonly DashboardTileId[]) => {
		const sectionTileIds = new Set<DashboardTileId>(tileIds);
		return sortedLayout
			.filter((tile) => sectionTileIds.has(tile.id))
			.map((tile) => tile.id);
	};

	const heroTileIds = getOrderedSectionTileIds(HERO_TILE_IDS);
	const needsTileIds = getOrderedSectionTileIds(NEEDS_TILE_IDS);
	const dayTileIds = getOrderedSectionTileIds(DAY_TILE_IDS);
	const practiceTileIds = getOrderedSectionTileIds(PRACTICE_TILE_IDS);

	const activeSpan = activeId ? getSpan(activeId) : null;

	return (
		<>
			<DashboardRoot>
				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
					onDragStart={handleDragStart}
					sensors={sensors}
				>
					<SortableContext items={sortedIds} strategy={rectSortingStrategy}>
						<BentoGridWrapper>
							<DashboardSections>
								<DashboardSection>
									<BentoGrid>{renderSectionTiles(heroTileIds)}</BentoGrid>
								</DashboardSection>

								<DashboardSection aria-labelledby='dashboard-zone-needs'>
									<DashboardSectionLabel id='dashboard-zone-needs'>
										{t('page.dashboard.zones.needs')}
									</DashboardSectionLabel>
									<BentoGrid>
										{renderSectionTiles(needsTileIds, heroTileIds.length)}
									</BentoGrid>
								</DashboardSection>

								<DashboardSection aria-labelledby='dashboard-zone-day'>
									<DashboardSectionLabel id='dashboard-zone-day'>
										{t('page.dashboard.zones.day')}
									</DashboardSectionLabel>
									<BentoGrid>
										{renderSectionTiles(
											dayTileIds,
											heroTileIds.length + needsTileIds.length
										)}
									</BentoGrid>
								</DashboardSection>

								<DashboardSection aria-labelledby='dashboard-zone-practice'>
									<DashboardSectionLabel id='dashboard-zone-practice'>
										{t('page.dashboard.zones.practice')}
									</DashboardSectionLabel>
									<BentoGrid>
										{renderSectionTiles(
											practiceTileIds,
											heroTileIds.length + needsTileIds.length + dayTileIds.length
										)}
									</BentoGrid>
								</DashboardSection>
							</DashboardSections>
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
