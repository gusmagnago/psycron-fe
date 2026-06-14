import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAppointmentDetailsBySlotId } from '@psycron/api/user/availability';
import { AvailabilityLegend } from '@psycron/components/availability/AvailabilityLegend';
import { NavButton } from '@psycron/components/availability/AvailabilityNavButton';
import {
	ChevronLeft,
	ChevronRight,
	Filter,
	FilterFull,
	Settings,
} from '@psycron/components/icons';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import useViewport from '@psycron/hooks/useViewport';
import { useQueryClient } from '@tanstack/react-query';
import { format, isPast, isToday, parseISO } from 'date-fns';

import { AvailabilityReadinessPanel } from '../workspace/AvailabilityReadinessPanel';
import { AvailabilityViewToggle } from '../workspace/AvailabilityViewToggle';
import type {
	AvailabilityViewMode,
	AvailabilityViewSelection,
} from '../workspace/AvailabilityViewToggle.types';
import { AvailabilityWorkspaceShell } from '../workspace/AvailabilityWorkspaceShell';
import type { AvailabilityWorkspaceShellHandle } from '../workspace/AvailabilityWorkspaceShell.types';
import { useAvailabilityStatusItems } from '../workspace/useAvailabilityStatusItems';

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
	WeekFooterSettingsButton,
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
		googleCalendarColor,
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
	const shellRef = useRef<AvailabilityWorkspaceShellHandle>(null);
	const [viewMode, setViewMode] = useState<AvailabilityViewMode>('week');
	const [isReadinessPanelOpen, setIsReadinessPanelOpen] = useState(false);

	const handleViewSelection = useCallback(
		(selection: AvailabilityViewSelection): void => {
			if (selection === 'month') {
				shellRef.current?.openPanel();
				return;
			}
			setViewMode(selection);
		},
		[]
	);

	const [selectedSlot, setSelectedSlot] = useState<IWeekSlot | null>(null);
	const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
		null
	);
	const [dayPopoverDate, setDayPopoverDate] = useState<string | null>(null);
	const debugNowMinutes = parseDebugNowMinutes(searchParams.get('debugNow'));
	const slotIdParam = searchParams.get('slotId');
	const activeDate = useMemo(
		() => (date ? parseISO(date) : new Date()),
		[date]
	);
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
			aria-label={t('availability.week.filters')}
			data-testid='availability-filter-button'
			id='availability-filter-button'
			size='small'
		>
			{activeFilterCount > 0 ? <FilterFull /> : <Filter />}
		</FilterButton>
	);

	const settingsButton = (
		<WeekFooterSettingsButton
			aria-label={t('availability.week.settings')}
			data-testid='availability-settings-button'
			id='availability-settings-button'
			onClick={goToSettings}
			size='small'
		>
			<Settings />
		</WeekFooterSettingsButton>
	);

	const prevButton = (
		<NavButton
			disabled={!canGoPrev}
			onClick={goToPrevWeek}
			aria-label={t('availability.week.prev-week')}
			data-testid='availability-week-prev-button'
			id='availability-week-prev-button'
		>
			<ChevronLeft />
		</NavButton>
	);
	const nextButton = (
		<NavButton
			disabled={!canGoNext}
			onClick={goToNextWeek}
			aria-label={t('availability.week.next-week')}
			data-testid='availability-week-next-button'
			id='availability-week-next-button'
		>
			<ChevronRight />
		</NavButton>
	);

	useEffect(() => {
		if (!slotIdParam || selectedSlot?._id === slotIdParam) return;

		const slot = Object.values(weekData)
			.flat()
			.find((weekSlot) => weekSlot._id === slotIdParam);

		if (slot) setSelectedSlot(slot);
	}, [selectedSlot?._id, slotIdParam, weekData]);

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
					busy: 0,
					cancelled: 0,
				} satisfies Record<IWeekSlot['status'], number>
			),
		[weekSlots]
	);
	const googleConnected = Boolean(availability?.googleCalendarConnected);
	const hasSlots = slotStats.available > 0;

	const statusItems = useAvailabilityStatusItems({
		availableSlots: slotStats.available,
		googleConnected,
	});

	const workspaceActions = filterButton;

	const viewbarTitle =
		viewMode === 'day' ? format(activeDate, 'EEEE, MMMM d, yyyy') : weekRange;

	const viewbar = (
		<WeekWorkspaceViewbar
			data-testid='availability-calendar-viewbar'
			id='availability-calendar-viewbar'
		>
			<WeekWorkspaceTitleGroup
				data-testid='availability-week-title-group'
				id='availability-week-title-group'
			>
				{prevButton}
				<WeekWorkspaceTitleCopy>
					<WeekWorkspaceTitle id='availability-week-title'>
						{viewbarTitle}
					</WeekWorkspaceTitle>
					<WeekWorkspaceSubtitle
						data-testid='availability-week-subtitle'
						id='availability-week-subtitle'
					>
						{t('availability.workspace.viewbar-helper')}
					</WeekWorkspaceSubtitle>
				</WeekWorkspaceTitleCopy>
				{nextButton}
			</WeekWorkspaceTitleGroup>
			<WeekWorkspaceControls
				data-testid='availability-week-controls'
				id='availability-week-controls'
			>
				<AvailabilityViewToggle
					dayLabel={t('availability.workspace.view-day')}
					monthLabel={t('availability.workspace.view-month')}
					value={isReadinessPanelOpen ? 'month' : viewMode}
					viewModeLabel={t('availability.workspace.view-mode-label')}
					weekLabel={t('availability.workspace.view-week')}
					onChange={handleViewSelection}
				/>
			</WeekWorkspaceControls>
		</WeekWorkspaceViewbar>
	);

	return (
		<>
			<AvailabilityWorkspaceShell
				ref={shellRef}
				actions={workspaceActions}
				footer={
					<WeekFooter
						id='availability-week-footer'
						data-testid='availability-week-footer'
					>
						<AvailabilityLegend items={legendItems} />
						{settingsButton}
					</WeekFooter>
				}
				isLoading={isLoading}
				panel={
					<AvailabilityReadinessPanel
						activeDate={activeDate}
						checklistTitle={t('availability.workspace.checklist-title')}
						googleChecklistLabel={
							googleConnected
								? t('availability.workspace.checklist-google-connected')
								: t('availability.workspace.checklist-google-missing')
						}
						hasGoogleConnected={googleConnected}
						hasSlots={hasSlots}
						jupiterDescription={t('availability.workspace.jupiter-description')}
						jupiterLabel={t('availability.workspace.jupiter-label')}
						jupiterSuggestion={t('availability.workspace.jupiter-suggestion')}
						jupiterToggleLabel={t(
							'availability.workspace.jupiter-toggle-label'
						)}
						slotChecklistLabel={
							hasSlots
								? t('availability.workspace.checklist-slots-ready', {
										count: slotStats.available,
									})
								: t('availability.workspace.checklist-slots-empty')
						}
						statusItems={statusItems}
						statusTitle={t('availability.workspace.status-title')}
					/>
				}
				subtitle={t('availability.workspace.subtitle')}
				title={t('availability.workspace.page-title')}
				viewbar={viewbar}
				onPanelOpenChange={setIsReadinessPanelOpen}
			>
				<WeekCalendarScroll
					aria-label={t('availability.workspace.calendar-scroll-label')}
					data-testid='availability-calendar-scroll'
					id='availability-calendar-scroll'
				>
					{isMobile ? (
						<AvailabilityWeekMobileList
							days={visibleMobileDays}
							googleCalendarColor={googleCalendarColor}
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
							googleCalendarColor={googleCalendarColor}
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
					data-testid='availability-week-drawer'
				/>
			)}
		</>
	);
};
