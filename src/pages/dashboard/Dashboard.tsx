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
import type {
	DashboardActionTarget,
	DashboardQuickActionId,
} from '@psycron/api/dashboard/index.types';
import { BentoTile } from '@psycron/components/dashboard/bento-tile/BentoTile';
import { CustomizeControl } from '@psycron/components/dashboard/customize-control/CustomizeControl';
import { DashboardGreeting } from '@psycron/components/dashboard/greeting/DashboardGreeting';
import { ActivePatientsWidget } from '@psycron/components/dashboard/widgets/active-patients-widget/ActivePatientsWidget';
import { JupiterInsightsWidget } from '@psycron/components/dashboard/widgets/jupiter-insights-widget/JupiterInsightsWidget';
import { MetricCardWidget } from '@psycron/components/dashboard/widgets/metric-card-widget/MetricCardWidget';
import { PendingTasksWidget } from '@psycron/components/dashboard/widgets/pending-tasks-widget/PendingTasksWidget';
import type { PendingTask } from '@psycron/components/dashboard/widgets/pending-tasks-widget/PendingTasksWidget.types';
import { QuickActionsWidget } from '@psycron/components/dashboard/widgets/quick-actions-widget/QuickActionsWidget';
import { RecentPatientsWidget } from '@psycron/components/dashboard/widgets/recent-patients-widget/RecentPatientsWidget';
import type { RecentPatient } from '@psycron/components/dashboard/widgets/recent-patients-widget/RecentPatientsWidget.types';
import { ScheduleWidget } from '@psycron/components/dashboard/widgets/schedule-widget/ScheduleWidget';
import { ThisWeekWidget } from '@psycron/components/dashboard/widgets/this-week-widget/ThisWeekWidget';
import { WeeklyChartWidget } from '@psycron/components/dashboard/widgets/weekly-chart-widget/WeeklyChartWidget';
import type { WeeklyBarData } from '@psycron/components/dashboard/widgets/weekly-chart-widget/WeeklyChartWidget.types';
import {
	AddPatient,
	AlarmClockMinus,
	Available,
	Bell,
	CalendarRange,
	Patients,
	Payment,
	Settings,
} from '@psycron/components/icons';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useTimeOfDay } from '@psycron/hooks/useTimeOfDay';
import useViewport from '@psycron/hooks/useViewport';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import { AvailabilityWeekDrawer } from '@psycron/pages/availability/week/drawer/AvailabilityWeekDrawer';
import {
	ADDPATIENT,
	AVAILABILITYSETTINGS,
	AVAILABILITYWEEK_BASE,
	AVAILABILITYWIZARD,
	NOTIFICATIONS,
	PATIENTPROFILE,
	PATIENTS,
} from '@psycron/pages/urls';

import { useDashboardLayout } from './hooks/useDashboardLayout';
import { useDashboardSlots } from './hooks/useDashboardSlots';
import { useDashboardSummary } from './hooks/useDashboardSummary';
import { useJupiterInsights } from './hooks/useJupiterInsights';
import {
	BentoGrid,
	DashboardRoot,
	DashboardTopBar,
	DragOverlayCard,
} from './Dashboard.styles';
import type { DashboardTileId } from './Dashboard.types';

const TILE_DESKTOP: Record<DashboardTileId, { col: number; row: number }> = {
	'active-patients': { col: 3, row: 2 },
	'jupiter-insights': { col: 7, row: 2 },
	'pending-tasks': { col: 4, row: 2 },
	'quick-actions': { col: 4, row: 2 },
	'recent-patients': { col: 12, row: 2 },
	'billing-readiness': { col: 6, row: 2 },
	schedule: { col: 5, row: 4 },
	'this-week': { col: 6, row: 2 },
	'weekly-chart': { col: 8, row: 2 },
};

const TILE_TABLET: Record<DashboardTileId, { col: number; row: number }> = {
	'active-patients': { col: 3, row: 2 },
	'jupiter-insights': { col: 6, row: 2 },
	'pending-tasks': { col: 6, row: 2 },
	'quick-actions': { col: 3, row: 2 },
	'recent-patients': { col: 6, row: 2 },
	'billing-readiness': { col: 3, row: 2 },
	schedule: { col: 6, row: 2 },
	'this-week': { col: 3, row: 2 },
	'weekly-chart': { col: 6, row: 2 },
};

const MIN_TILE_ROW_SPAN = 1;
const MAX_TILE_ROW_SPAN = 6;

const TILE_MIN_HEIGHT: Record<DashboardTileId, number> = {
	'active-patients': 180,
	'jupiter-insights': 240,
	'pending-tasks': 200,
	'quick-actions': 260,
	'recent-patients': 280,
	'billing-readiness': 180,
	schedule: 400,
	'this-week': 200,
	'weekly-chart': 220,
};

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
		isCustomizing,
		layout,
		reorderLayout,
		resizeTile,
		resetLayout,
		setCustomizing,
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

	const patientCount =
		summary?.activePatients.count ?? userDetails?.patients?.length ?? 0;
	const hasAvailability =
		summary?.setup.hasAvailability ?? (userDetails?.availability?.length ?? 0) > 0;
	const whatsappRemindersEnabled =
		summary?.setup.remindersEnabled ??
		userDetails?.notificationPreferences?.reminder?.whatsapp;

	const { insights: jupiterInsights, isLoading: isJupiterInsightsLoading } =
		useJupiterInsights({
		hasAvailability,
		metrics,
			patientCount,
		weekStart,
		whatsappRemindersEnabled,
		});

	const getTargetNav = useCallback(
		(target: DashboardActionTarget): { state?: Record<string, unknown>; to: string } => {
			switch (target.type) {
				case 'add-patient':
					return { to: `../${ADDPATIENT}` };
				case 'availability-settings':
					return { to: `../${AVAILABILITYSETTINGS}` };
				case 'availability-week':
					return {
						to: target.date
							? `../${AVAILABILITYWEEK_BASE}/${target.date}`
							: `../${AVAILABILITYWEEK_BASE}`,
					};
				case 'availability-wizard':
					return { to: `../${AVAILABILITYWIZARD}` };
				case 'notification-settings':
					return { state: { openSettings: true }, to: `../${NOTIFICATIONS}` };
				case 'patients':
					return { to: `../${PATIENTS}` };
			}
		},
		[]
	);

	const getQuickActionIcon = useCallback((id: DashboardQuickActionId) => {
		switch (id) {
			case 'add-patient':
				return <AddPatient />;
			case 'availability-settings':
				return <Available />;
			case 'fix-reminders':
				return <Bell />;
			case 'follow-up-cancellations':
				return <AlarmClockMinus />;
			case 'patients':
				return <Patients />;
			case 'setup-availability':
				return <Settings />;
			case 'view-week':
				return <CalendarRange />;
		}
	}, []);

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
		[getQuickActionIcon, getTargetNav, navigate, summary?.quickActions, summary?.tier, t]
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
		[getTargetNav, navigate, summary?.pendingTasks, summary?.tier, t]
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

		const commonProps = {
			ariaLabel: t(`page.dashboard.tiles.${tileId}`),
			colSpan: col,
			id: tileId,
			index,
			isEditMode: isCustomizing,
			isHidden: !(tile?.visible ?? true),
			onResize: resizeTile,
			onToggleVisibility: toggleVisibility,
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

			case 'active-patients':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<ActivePatientsWidget
							isLoading={isSummaryLoading}
							onPatientClick={(id) =>
								navigate(`../${PATIENTPROFILE.replace(':patientId', id)}`)
							}
							patients={summary?.latestPatients ?? []}
						/>
					</BentoTile>
				);

			case 'billing-readiness':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<MetricCardWidget
							icon={<Payment />}
							isLoading={isSummaryLoading}
							label={t('page.dashboard.widgets.billing-readiness.label')}
							onClick={() => {
								capture(PostHogEvent.DashboardBillingReadinessClicked, {
									percentage: summary?.billingReadiness.percentage ?? 0,
									source: 'dashboard-summary',
									tier: summary?.tier ?? 'unknown',
									tile_id: 'billing-readiness',
								});
								navigate(`../${PATIENTS}`);
							}}
							subLabel={t(
								`page.dashboard.widgets.billing-readiness.status.${summary?.billingReadiness.status ?? 'empty'}`,
								{
									configured: summary?.billingReadiness.configuredCount ?? 0,
									missing: summary?.billingReadiness.missingCount ?? 0,
									total: summary?.billingReadiness.totalCount ?? 0,
								}
							)}
							suffix='%'
							value={summary?.billingReadiness.percentage ?? 0}
						/>
					</BentoTile>
				);

			case 'this-week':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<ThisWeekWidget
							data={{
								blocked: summary?.week.adminBlockedSlots ?? 0,
								cancelled:
									summary?.week.cancelledCount ?? metrics.weekCancelledCount,
								completed:
									summary?.week.completedCount ?? metrics.weekCompletedCount,
								upcoming: summary?.week.upcomingCount ?? metrics.weekUpcomingCount,
							}}
							isLoading={isSummaryLoading}
						/>
					</BentoTile>
				);

			case 'weekly-chart':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<WeeklyChartWidget
							data={weeklyChartData}
							isLoading={isSummaryLoading}
							onDayClick={(day) => {
								capture(PostHogEvent.DashboardChartDayClicked, {
									date: day.date,
									source: 'dashboard-summary',
									tier: summary?.tier ?? 'unknown',
									tile_id: 'weekly-chart',
								});
								navigate(`../${AVAILABILITYWEEK_BASE}/${day.date}`);
							}}
						/>
					</BentoTile>
				);

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
						<BentoGrid>
							{sortedLayout.map((tile, index) => renderTile(tile.id, index))}
						</BentoGrid>
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
