import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAppointmentDetailsBySlotId } from '@psycron/api/user/availability';
import { AvailabilityLegend } from '@psycron/components/availability/AvailabilityLegend';
import { NavButton } from '@psycron/components/availability/AvailabilityNavButton';
import { AvailabilityTodayButton } from '@psycron/components/availability/AvailabilityTodayButton';
import { Button } from '@psycron/components/button/Button';
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Filter,
	FilterFull,
} from '@psycron/components/icons';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import useViewport from '@psycron/hooks/useViewport';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { useQueryClient } from '@tanstack/react-query';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { Settings } from 'lucide-react';

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
	WeekCard,
	WeekFeaturesActions,
	WeekFeaturesWrapper,
	WeekFooter,
	WeekFooterActions,
	WeekHeader,
	WeekNavRow,
	WeekSubtitle,
	WeekTitle,
	WeekTitleBlock,
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
		goToMonth,
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

	const [selectedSlot, setSelectedSlot] = useState<IWeekSlot | null>(null);
	const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
		null
	);
	const [dayPopoverDate, setDayPopoverDate] = useState<string | null>(null);
	const [shouldScrollToToday, setShouldScrollToToday] = useState(false);
	const debugNowMinutes = parseDebugNowMinutes(searchParams.get('debugNow'));
	const slotIdParam = searchParams.get('slotId');

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

	const navButtons = (
		<>
			<Button small tertiary onClick={goToMonth}>
				<Calendar />
				{!isMobile ? t('components.agenda.month') : null}
			</Button>
			<Button
				small
				tertiary
				aria-label={t('availability.week.settings')}
				onClick={goToSettings}
			>
				<Settings />
				{!isMobile ? t('availability.week.settings') : null}
			</Button>
		</>
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
	}, [isMobile, mobileDays, shouldScrollToToday]);

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

	return (
		<PageLayout
			title={t('availability.week.page-title')}
			isLoading={isLoading}
			backButton
		>
			<WeekCard>
				<WeekHeader>
					<WeekFeaturesWrapper>
						<WeekNavRow>
							{prevButton}
							<WeekTitleBlock>
								<WeekTitle>{t('availability.week.title')}</WeekTitle>
								<WeekSubtitle>{weekRange}</WeekSubtitle>
							</WeekTitleBlock>
							{nextButton}
						</WeekNavRow>
						<WeekFeaturesActions>
							{filterButton}
							{todayButton}
							{isMobile && navButtons}
						</WeekFeaturesActions>
					</WeekFeaturesWrapper>
				</WeekHeader>

				{isMobile ? (
					<AvailabilityWeekMobileList
						days={mobileDays}
						todayCardId={todayCardId}
						onDayHeaderClick={handleDayHeaderClick}
						onSlotClick={handleSlotClick}
						onSlotPointerDown={handleSlotPointerDown}
						onToggleDayExpanded={toggleDayExpanded}
					/>
				) : (
					<AvailabilityWeekDesktopGrid
						debugNowMinutes={debugNowMinutes}
						getDaySlots={getDaySlots}
						getVisibleDaySlots={getVisibleDaySlots}
						onDayHeaderClick={handleDayHeaderClick}
						onSlotClick={handleSlotClick}
						onSlotPointerDown={handleSlotPointerDown}
						weekData={weekData}
						weekDays={weekDays}
					/>
				)}

				<WeekFooter>
					<AvailabilityLegend items={legendItems} />
					{!isMobile && <WeekFooterActions>{navButtons}</WeekFooterActions>}
				</WeekFooter>
			</WeekCard>

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
		</PageLayout>
	);
};
