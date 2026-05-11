import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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
import { JupiterInsightsWidget } from '@psycron/components/dashboard/widgets/jupiter-insights-widget/JupiterInsightsWidget';
import type { JupiterInsight } from '@psycron/components/dashboard/widgets/jupiter-insights-widget/JupiterInsightsWidget.types';
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
import { AddPatient, Appointment, Patients } from '@psycron/components/icons';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useTimeOfDay } from '@psycron/hooks/useTimeOfDay';
import useViewport from '@psycron/hooks/useViewport';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import {
	ADDPATIENT,
	AVAILABILITYWEEK_BASE,
	NOTIFICATIONS,
	PATIENTS,
} from '@psycron/pages/urls';
import { format, isSameDay, parseISO } from 'date-fns';

import { useDashboardLayout } from './hooks/useDashboardLayout';
import { useDashboardSlots } from './hooks/useDashboardSlots';
import {
	BentoGrid,
	DashboardRoot,
	DashboardTopBar,
	DragOverlayCard,
} from './Dashboard.styles';
import type { DashboardTileId } from './Dashboard.types';

const TILE_DESKTOP: Record<DashboardTileId, { col: number; row: number }> = {
	'active-patients': { col: 3, row: 1 },
	'jupiter-insights': { col: 7, row: 1 },
	'pending-tasks': { col: 4, row: 1 },
	'quick-actions': { col: 4, row: 1 },
	'recent-patients': { col: 12, row: 1 },
	'revenue-mtd': { col: 6, row: 1 },
	schedule: { col: 5, row: 2 },
	'this-week': { col: 6, row: 1 },
	'weekly-chart': { col: 8, row: 1 },
};

const TILE_TABLET: Record<DashboardTileId, { col: number; row: number }> = {
	'active-patients': { col: 3, row: 1 },
	'jupiter-insights': { col: 6, row: 1 },
	'pending-tasks': { col: 6, row: 1 },
	'quick-actions': { col: 3, row: 1 },
	'recent-patients': { col: 6, row: 1 },
	'revenue-mtd': { col: 3, row: 1 },
	schedule: { col: 6, row: 1 },
	'this-week': { col: 3, row: 1 },
	'weekly-chart': { col: 6, row: 1 },
};

const TILE_MIN_HEIGHT: Record<DashboardTileId, number> = {
	'active-patients': 180,
	'jupiter-insights': 240,
	'pending-tasks': 200,
	'quick-actions': 260,
	'recent-patients': 280,
	'revenue-mtd': 180,
	schedule: 400,
	'this-week': 200,
	'weekly-chart': 220,
};

export const Dashboard = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { locale } = useParams<{ locale: string }>();
	const { userDetails } = useUserDetails();
	const band = useTimeOfDay();
	const { isMobile, isBiggerThanTablet } = useViewport();
	const { isLoading, todaySlots, weekEnd, weekSlotsByDay, weekStart } = useDashboardSlots();
	const {
		isCustomizing,
		layout,
		reorderLayout,
		resetLayout,
		setCustomizing,
		toggleVisibility,
	} = useDashboardLayout();

	const [activeId, setActiveId] = useState<DashboardTileId | null>(null);

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
			reorderLayout(
				active.id as DashboardTileId,
				over.id as DashboardTileId
			);
			capture(PostHogEvent.DashboardTileReordered, {
				from_index: fromIdx,
				tile_id: active.id as string,
				to_index: toIdx,
			});
		}
		setActiveId(null);
	};

	const weeklyChartData = useMemo<WeeklyBarData[]>(() => {
		const today = new Date();
		return Object.entries(weekSlotsByDay)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([date, slots]) => {
				const parsed = parseISO(date);
				return {
					cancelled: slots.filter((s) => s.status === 'cancelled').length,
					completed: slots.filter((s) => s.status === 'booked-google').length,
					confirmed: slots.filter((s) => s.status === 'booked-jupiter').length,
					date,
					isToday: isSameDay(parsed, today),
					label: format(parsed, 'EEE'),
				};
			});
	}, [weekSlotsByDay]);

	const thisWeekData = useMemo(() => {
		const allSlots = Object.values(weekSlotsByDay).flat();
		return {
			cancelled: allSlots.filter((s) => s.status === 'cancelled').length,
			completed: allSlots.filter((s) => s.status === 'booked-google').length,
			upcoming: allSlots.filter((s) => s.status === 'booked-jupiter').length,
		};
	}, [weekSlotsByDay]);

	const patientCount = userDetails?.patients?.length ?? 0;

	const jupiterInsights = useMemo<JupiterInsight[]>(
		() => [
			{
				actionLabel: t(
					'page.dashboard.widgets.jupiter-insights.action-send-message'
				),
				category: t(
					'page.dashboard.widgets.jupiter-insights.category-patient-care'
				),
				id: 'insight-followup',
				onAction: () => navigate(`../${PATIENTS}`),
				onSecondaryAction: () => navigate(`../${PATIENTS}`),
				secondaryActionLabel: t(
					'page.dashboard.widgets.jupiter-insights.action-view-profile'
				),
				text: t('page.dashboard.widgets.jupiter-insights.text-schedule', {
					count: todaySlots.filter(
						(s) =>
							s.status === 'booked-jupiter' || s.status === 'booked-google'
					).length,
				}),
			},
			{
				category: t(
					'page.dashboard.widgets.jupiter-insights.category-insights'
				),
				id: 'insight-patients',
				text: t('page.dashboard.widgets.jupiter-insights.text-patients', {
					count: patientCount,
				}),
			},
		],
		[t, todaySlots, patientCount, navigate]
	);

	const quickActions = useMemo(
		() => [
			{
				ariaLabel: t(
					'page.dashboard.widgets.quick-actions.actions.new-session-aria'
				),
				icon: <Appointment />,
				id: 'new-session',
				label: t('page.dashboard.widgets.quick-actions.actions.new-session'),
				onClick: () => navigate(`../${AVAILABILITYWEEK_BASE}`),
			},
			{
				ariaLabel: t(
					'page.dashboard.widgets.quick-actions.actions.patients-aria'
				),
				icon: <Patients />,
				id: 'patients',
				label: t('page.dashboard.widgets.quick-actions.actions.patients'),
				onClick: () => navigate(`../${PATIENTS}`),
			},
			{
				ariaLabel: t(
					'page.dashboard.widgets.quick-actions.actions.add-patient-aria'
				),
				icon: <AddPatient />,
				id: 'add-patient',
				label: t('page.dashboard.widgets.quick-actions.actions.add-patient'),
				onClick: () => navigate(`../${ADDPATIENT}`),
			},
			{
				ariaLabel: t(
					'page.dashboard.widgets.quick-actions.actions.notifications-aria'
				),
				icon: <Appointment />,
				id: 'notifications',
				label: t(
					'page.dashboard.widgets.quick-actions.actions.notifications'
				),
				onClick: () => navigate(`../${NOTIFICATIONS}`),
			},
		],
		[t, navigate]
	);

	const pendingTasks = useMemo<PendingTask[]>(
		() => [
			{
				count: 0,
				label: t('page.dashboard.widgets.pending-tasks.session-notes'),
				onClick: () => navigate(`../${PATIENTS}`),
				type: 'session-notes',
			},
			{
				count: 0,
				label: t('page.dashboard.widgets.pending-tasks.invoices'),
				onClick: () => navigate(`../${PATIENTS}`),
				type: 'invoices',
			},
			{
				count: 0,
				label: t('page.dashboard.widgets.pending-tasks.messages'),
				onClick: () => navigate(`../${NOTIFICATIONS}`),
				type: 'messages',
			},
		],
		[t, navigate]
	);

	const recentPatients = useMemo<RecentPatient[]>(() => [], []);

	const getSpan = (id: DashboardTileId) => {
		if (isMobile) return { col: 1, row: 1 };
		return isBiggerThanTablet ? TILE_DESKTOP[id] : TILE_TABLET[id];
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
			onToggleVisibility: toggleVisibility,
			rowSpan: row,
		};

		switch (tileId) {
			case 'schedule':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<ScheduleWidget
							isLoading={isLoading}
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
							isLoading={isLoading}
						/>
					</BentoTile>
				);

			case 'quick-actions':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<QuickActionsWidget actions={quickActions} />
					</BentoTile>
				);

			case 'active-patients':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<MetricCardWidget
							icon={<Patients />}
							isLoading={isLoading}
							label={t('page.dashboard.widgets.active-patients.label')}
							value={patientCount}
						/>
					</BentoTile>
				);

			case 'revenue-mtd':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<MetricCardWidget
							isLoading={false}
							label={t('page.dashboard.widgets.revenue-mtd.label')}
							prefix={locale?.includes('pt') ? 'R$ ' : '€'}
							sparkline={[0, 0, 0, 0, 0, 0, 0].map((v) => ({ value: v }))}
							value={0}
						/>
					</BentoTile>
				);

			case 'this-week':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<ThisWeekWidget data={thisWeekData} isLoading={isLoading} />
					</BentoTile>
				);

			case 'weekly-chart':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<WeeklyChartWidget data={weeklyChartData} isLoading={isLoading} />
					</BentoTile>
				);

			case 'pending-tasks':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<PendingTasksWidget isLoading={false} tasks={pendingTasks} />
					</BentoTile>
				);

			case 'recent-patients':
				return (
					<BentoTile {...commonProps} key={tileId}>
						<RecentPatientsWidget
							isLoading={isLoading && recentPatients.length === 0}
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
					<SortableContext
						items={sortedIds}
						strategy={rectSortingStrategy}
					>
						<BentoGrid>
							{sortedLayout.map((tile, index) =>
								renderTile(tile.id, index)
							)}
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
		</PageLayout>
	);
};
