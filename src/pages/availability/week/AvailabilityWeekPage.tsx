import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAppointmentDetailsBySlotId } from '@psycron/api/user/availability';
import { AvailabilityLegend } from '@psycron/components/availability/AvailabilityLegend';
import { NavButton } from '@psycron/components/availability/AvailabilityNavButton';
import { AvailabilityTodayButton } from '@psycron/components/availability/AvailabilityTodayButton';
import { Button } from '@psycron/components/button/Button';
import {
	Calendar,
	CheckSuccess,
	ChevronLeft,
	ChevronRight,
	Filter,
	FilterFull,
	Google,
	Refresh,
	Settings,
	TriangleAlert,
} from '@psycron/components/icons';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import useViewport from '@psycron/hooks/useViewport';
import { useQueryClient } from '@tanstack/react-query';
import { format, isPast, isToday, parseISO } from 'date-fns';

import { AvailabilityControlsPanel } from '../workspace/AvailabilityControlsPanel';
import { AvailabilityReadinessPanel } from '../workspace/AvailabilityReadinessPanel';
import { AvailabilityViewToggle } from '../workspace/AvailabilityViewToggle';
import type { AvailabilityViewMode } from '../workspace/AvailabilityViewToggle.types';
import { AvailabilityWorkspaceShell } from '../workspace/AvailabilityWorkspaceShell';

import { DayHeaderPopover } from './day-header-popover/DayHeaderPopover';
import { AvailabilityWeekDrawer } from './drawer/AvailabilityWeekDrawer';
import { AvailabilityWeekFilters } from './filters/AvailabilityWeekFilters';
import { useAvailabilityWeekViewModel } from './hook/useAvailabilityWeekViewModel';
import { useClosedDayOverride } from './hook/useClosedDayOverride';
import { useBlockDay, useUnblockDay } from './hook/useDayActions';
import { OpenClosedDayModal } from './open-closed-day-modal/OpenClosedDayModal';
import { AvailabilityWeekDesktopGrid } from './views/desktop-view/AvailabilityWeekDesktopGrid';
import { AvailabilityWeekMobileList } from './views/mobile-view/AvailabilityWeekMobileList';
import {
	FilterButton,
	WeekCalendarScroll,
	WeekFooter,
	WeekWorkspaceControls,
	WeekWorkspaceSubtitle,
	WeekWorkspaceTitle,
	WeekWorkspaceTitleCopy,
	WeekWorkspaceTitleGroup,
	WeekWorkspaceViewbar,
} from './AvailabilityWeekPage.styles';
import type { IWeekSlot } from './AvailabilityWeekPage.types';
import { parseDebugNowMinutes } from './AvailabilityWeekPage.utils';

export const AvailabilityWeekPage = () => {
	const todayCardId = 'availability-week-mobile-today';
	const { t } = useTranslation();
	const { date } = useParams<{ date: string }>();
	const [searchParams] = useSearchParams();
	const { isMobile } = useViewport();
	const {
		activeFilterCount,
		allSessionTypes,
		canGoNext,
		canGoPrev,
		clearFilters,
		getDaySlots,
		getVisibleDaySlots,
		goToNextWeek,
		goToPrevWeek,
		goToSettings,
		goToTodayWeek,
		isLoading,
		legendItems,
		mobileDays,
		prefs,
		toggleDayExpanded,
		toggleDeliveryMode,
		toggleSessionType,
		toggleShowCancelledSlots,
		toggleShowFreeSlots,
		toggleTimeOfDay,
		weekData,
		weekDays,
		weekRange,
	} = useAvailabilityWeekViewModel({ date });
	const { availability } = useJupiterAvailabilityConfig();
	const [viewMode, setViewMode] = useState<AvailabilityViewMode>('week');

	const [selectedSlot, setSelectedSlot] = useState<IWeekSlot | null>(null);
	const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
		null
	);
	const [dayPopoverDate, setDayPopoverDate] = useState<string | null>(null);
	const [shouldScrollToToday, setShouldScrollToToday] = useState(false);
	const debugNowMinutes = parseDebugNowMinutes(searchParams.get('debugNow'));
	const slotIdParam = searchParams.get('slotId');
	const activeDate = useMemo(() => (date ? parseISO(date) : new Date()), [date]);
	const activeDateStr = format(activeDate, 'yyyy-MM-dd');
	const visibleMobileDays = useMemo(
		() =>
			viewMode === 'day'
				? mobileDays.filter((day) => day.dateStr === activeDateStr)
				: mobileDays,
		[activeDateStr, mobileDays, viewMode]
	);

	const queryClient = useQueryClient();
	const therapistId = useTherapistId();
	const closedDayOverride = useClosedDayOverride({
		availability,
		therapistId,
	});

	const blockDay = useBlockDay(therapistId, () => {
		setDayPopoverDate(null);
	});
	const unblockDay = useUnblockDay(therapistId, () => {
		setDayPopoverDate(null);
	});

	const handleDayHeaderClick = (dateStr: string) => {
		const dayDate = parseISO(dateStr);
		if (isPast(dayDate) && !isToday(dayDate)) return;
		if (getDaySlots(dayDate).length === 0) {
			closedDayOverride.open(dateStr);
			return;
		}
		setDayPopoverDate(dateStr);
	};

	const handleSlotClick = (slot: IWeekSlot) => setSelectedSlot(slot);

	const handleTodayClick = useCallback(() => {
		setShouldScrollToToday(true);
		goToTodayWeek();
	}, [goToTodayWeek]);

	const handleSlotPointerDown = useCallback(
		(slot: IWeekSlot) => {
			const isBooked =
				slot.status === 'booked-jupiter' || slot.status === 'booked-google';
			if (!isBooked || !slot.availabilityDayId || !slot._id) return;
			queryClient.prefetchQuery({
				queryKey: ['slotAppointmentDetails', slot._id],
				queryFn: () =>
					getAppointmentDetailsBySlotId(
						therapistId,
						slot.availabilityDayId!,
						slot._id!
					),
				staleTime: 1000 * 60 * 5,
			});
		},
		[queryClient, therapistId]
	);

	const filterButton = (
		<FilterButton
			isActive={activeFilterCount > 0}
			onClick={(e) => setFilterAnchorEl(e.currentTarget as HTMLElement)}
			small
			variant='outlined'
		>
			{activeFilterCount > 0 ? <FilterFull /> : <Filter />}
			{!isMobile ? t('availability.week.filters') : null}
		</FilterButton>
	);

	const settingsButton = (
		<Button
			small
			tertiary
			aria-label={t('availability.week.settings')}
			onClick={goToSettings}
		>
			<Settings />
			{!isMobile ? t('availability.week.settings') : null}
		</Button>
	);

	const syncButton = (
		<Button
			small
			tertiary
			aria-label={t('availability.workspace.sync-google')}
			onClick={goToSettings}
			variant='outlined'
		>
			<Refresh />
			{!isMobile ? t('availability.workspace.sync-google') : null}
		</Button>
	);

	const prevButton = (
		<NavButton
			disabled={!canGoPrev}
			onClick={goToPrevWeek}
			aria-label={t('availability.week.prev-week')}
		>
			<ChevronLeft />
		</NavButton>
	);
	const nextButton = (
		<NavButton
			disabled={!canGoNext}
			onClick={goToNextWeek}
			aria-label={t('availability.week.next-week')}
		>
			<ChevronRight />
		</NavButton>
	);

	useEffect(() => {
		if (!isMobile || !shouldScrollToToday) return;

		const todayCard = document.getElementById(todayCardId);
		if (!todayCard) return;

		const frameId = window.requestAnimationFrame(() => {
			todayCard.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
			setShouldScrollToToday(false);
		});

		return () => window.cancelAnimationFrame(frameId);
	}, [isMobile, shouldScrollToToday, visibleMobileDays]);

	useEffect(() => {
		if (!slotIdParam || selectedSlot?._id === slotIdParam) return;

		const slot = Object.values(weekData)
			.flat()
			.find((weekSlot) => weekSlot._id === slotIdParam);

		if (slot) setSelectedSlot(slot);
	}, [selectedSlot?._id, slotIdParam, weekData]);

	const todayButton = (
		<AvailabilityTodayButton
			iconOnly={isMobile}
			onClick={isMobile ? handleTodayClick : undefined}
		/>
	);

	const weekSlots = useMemo(() => Object.values(weekData).flat(), [weekData]);
	const slotStats = useMemo(
		() =>
			weekSlots.reduce(
				(acc, slot) => ({
					...acc,
					[slot.status]: acc[slot.status] + 1,
				}),
				{
					available: 0,
					blocked: 0,
					'booked-google': 0,
					'booked-jupiter': 0,
					buffer: 0,
					cancelled: 0,
				} satisfies Record<IWeekSlot['status'], number>
			),
		[weekSlots]
	);
	const googleConnected = Boolean(availability?.googleCalendarConnected);
	const hasSlots = slotStats.available > 0;

	const statusItems = [
		{
			badge: String(slotStats.available),
			description: hasSlots
				? t('availability.workspace.status-bookable-ready')
				: t('availability.workspace.status-bookable-empty'),
			icon: <CheckSuccess />,
			id: 'bookable',
			title: t('availability.workspace.status-bookable-title', {
				count: slotStats.available,
			}),
			tone: hasSlots ? 'success' as const : 'warn' as const,
		},
		{
			badge: '0',
			description: t('availability.workspace.status-conflicts-clear'),
			icon: <TriangleAlert />,
			id: 'conflicts',
			title: t('availability.workspace.status-conflicts-title', { count: 0 }),
			tone: 'success' as const,
		},
		{
			badge: googleConnected
				? t('availability.workspace.badge-live')
				: t('availability.workspace.badge-off'),
			description: googleConnected
				? t('availability.workspace.status-google-connected-desc')
				: t('availability.workspace.status-google-disconnected-desc'),
			icon: <Calendar />,
			id: 'google',
			title: googleConnected
				? t('availability.workspace.status-google-connected')
				: t('availability.workspace.status-google-disconnected'),
			tone: 'google' as const,
		},
	];

	const sourceItems = [
		{
			badge: t('availability.workspace.badge-on'),
			description: t('availability.workspace.source-psycron-desc'),
			icon: <Calendar />,
			id: 'psycron',
			title: t('availability.workspace.source-psycron-title'),
			tone: 'default' as const,
		},
		{
			badge: googleConnected
				? t('availability.workspace.badge-live')
				: t('availability.workspace.badge-off'),
			description: googleConnected
				? t('availability.workspace.source-google-desc')
				: t('availability.workspace.source-google-disconnected-desc'),
			icon: <Google />,
			id: 'google',
			title: t('availability.workspace.source-google-title'),
			tone: 'google' as const,
		},
	];

	const workspaceActions = (
		<>
			{filterButton}
			{todayButton}
			{syncButton}
			{settingsButton}
		</>
	);

	const viewbarTitle =
		viewMode === 'day'
			? format(activeDate, 'EEEE, MMMM d, yyyy')
			: weekRange;

	const viewbar = (
		<WeekWorkspaceViewbar
			data-testid='availability-calendar-viewbar'
			id='availability-calendar-viewbar'
		>
			<WeekWorkspaceTitleGroup>
				{prevButton}
				<WeekWorkspaceTitleCopy>
					<WeekWorkspaceTitle id='availability-week-title'>
						{viewbarTitle}
					</WeekWorkspaceTitle>
					<WeekWorkspaceSubtitle>
						{t('availability.workspace.viewbar-helper')}
					</WeekWorkspaceSubtitle>
				</WeekWorkspaceTitleCopy>
				{nextButton}
			</WeekWorkspaceTitleGroup>
			<WeekWorkspaceControls>
				<AvailabilityViewToggle
					dayLabel={t('availability.workspace.view-day')}
					value={viewMode}
					viewModeLabel={t('availability.workspace.view-mode-label')}
					weekLabel={t('availability.workspace.view-week')}
					onChange={setViewMode}
				/>
			</WeekWorkspaceControls>
		</WeekWorkspaceViewbar>
	);

	return (
		<>
			<AvailabilityWorkspaceShell
				actions={workspaceActions}
				footer={
					<WeekFooter>
						<AvailabilityLegend items={legendItems} />
					</WeekFooter>
				}
				isLoading={isLoading}
				leftPanel={
					<AvailabilityControlsPanel
						activeDate={activeDate}
						jupiterDescription={t(
							'availability.workspace.jupiter-description'
						)}
						jupiterLabel={t('availability.workspace.jupiter-label')}
						jupiterSuggestion={t('availability.workspace.jupiter-suggestion')}
						jupiterToggleLabel={t(
							'availability.workspace.jupiter-toggle-label'
						)}
						sourceItems={sourceItems}
						sourcesTitle={t('availability.workspace.sources-title')}
						statusItems={statusItems}
						statusTitle={t('availability.workspace.status-title')}
					/>
				}
				rightPanel={
					<AvailabilityReadinessPanel
						askJupiterLabel={t('availability.workspace.ask-jupiter')}
						checklistTitle={t('availability.workspace.checklist-title')}
						googleChecklistLabel={
							googleConnected
								? t('availability.workspace.checklist-google-connected')
								: t('availability.workspace.checklist-google-missing')
						}
						hasGoogleConnected={googleConnected}
						hasSlots={hasSlots}
						jupiterAnswer={t('availability.workspace.jupiter-answer')}
						jupiterLabel={t('availability.workspace.jupiter-label')}
						pwaNote={t('availability.workspace.pwa-note')}
						resolveLabel={t('availability.workspace.resolve-readiness')}
						slotChecklistLabel={
							hasSlots
								? t('availability.workspace.checklist-slots-ready', {
										count: slotStats.available,
									})
								: t('availability.workspace.checklist-slots-empty')
						}
					/>
				}
				subtitle={t('availability.workspace.subtitle')}
				title={t('availability.workspace.page-title')}
				viewbar={viewbar}
			>
				<WeekCalendarScroll
					aria-label={t('availability.workspace.calendar-scroll-label')}
					data-testid='availability-calendar-scroll'
					id='availability-calendar-scroll'
				>
					{isMobile ? (
						<AvailabilityWeekMobileList
							days={visibleMobileDays}
							todayCardId={todayCardId}
							onDayHeaderClick={handleDayHeaderClick}
							onSlotClick={handleSlotClick}
							onSlotPointerDown={handleSlotPointerDown}
							onToggleDayExpanded={toggleDayExpanded}
						/>
					) : (
						<AvailabilityWeekDesktopGrid
							activeDate={activeDate}
							debugNowMinutes={debugNowMinutes}
							getDaySlots={getDaySlots}
							getVisibleDaySlots={getVisibleDaySlots}
							onDayHeaderClick={handleDayHeaderClick}
							onSlotClick={handleSlotClick}
							onSlotPointerDown={handleSlotPointerDown}
							viewMode={viewMode}
							weekData={weekData}
							weekDays={weekDays}
						/>
					)}
				</WeekCalendarScroll>
			</AvailabilityWorkspaceShell>

			<AvailabilityWeekFilters
				activeFilterCount={activeFilterCount}
				allSessionTypes={allSessionTypes}
				anchorEl={filterAnchorEl}
				onClearFilters={clearFilters}
				onClose={() => setFilterAnchorEl(null)}
				onToggleDeliveryMode={toggleDeliveryMode}
				onToggleSessionType={toggleSessionType}
				onToggleShowCancelledSlots={toggleShowCancelledSlots}
				onToggleShowFreeSlots={toggleShowFreeSlots}
				onToggleTimeOfDay={toggleTimeOfDay}
				prefs={prefs}
			/>

			{dayPopoverDate &&
				(() => {
					const daySlots = getDaySlots(parseISO(dayPopoverDate));
					const availabilityDayId = daySlots[0]?.availabilityDayId ?? '';
					return (
						<DayHeaderPopover
							availabilityDayId={availabilityDayId}
							dayDate={dayPopoverDate}
							dayLabel={format(parseISO(dayPopoverDate), 'EEEE, MMMM d')}
							isBlockDayPending={blockDay.isPending}
							isPastDay={
								isPast(parseISO(dayPopoverDate)) &&
								!isToday(parseISO(dayPopoverDate))
							}
							isUnblockDayPending={unblockDay.isPending}
							open={Boolean(dayPopoverDate)}
							onBlockAll={() =>
								blockDay.mutate({
									availabilityDayId,
									dayDate: dayPopoverDate,
								})
							}
							onClose={() => {
								setDayPopoverDate(null);
							}}
							onUnblockAll={() =>
								unblockDay.mutate({
									availabilityDayId,
									dayDate: dayPopoverDate,
								})
							}
							slots={daySlots}
						/>
					);
				})()}

			<OpenClosedDayModal
				endTime={closedDayOverride.endTime}
				isConfirmDisabled={closedDayOverride.isConfirmDisabled}
				isLoading={closedDayOverride.isPending}
				mode={closedDayOverride.mode}
				openDate={closedDayOverride.overrideDate}
				overrideSlotOptions={closedDayOverride.overrideSlotOptions}
				partialSlotOptions={closedDayOverride.partialSlotOptions}
				selectedSpecificSlots={closedDayOverride.selectedSpecificSlots}
				startTime={closedDayOverride.startTime}
				onClose={closedDayOverride.close}
				onConfirm={closedDayOverride.confirm}
				onEndTimeChange={closedDayOverride.setEndTime}
				onModeChange={closedDayOverride.setMode}
				onSpecificSlotToggle={closedDayOverride.toggleSpecificSlot}
				onStartTimeChange={closedDayOverride.setStartTime}
			/>

			{selectedSlot && (
				<AvailabilityWeekDrawer
					slot={selectedSlot}
					onClose={() => setSelectedSlot(null)}
				/>
			)}
		</>
	);
};
