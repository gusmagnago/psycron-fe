import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { TextField } from '@mui/material';
import {
	createAvailabilityDateOverride,
	getAppointmentDetailsBySlotId,
} from '@psycron/api/user/availability';
import type { AvailabilityDateOverrideMode } from '@psycron/api/user/availability/index.types';
import { AvailabilityLegend } from '@psycron/components/availability/AvailabilityLegend';
import { NavButton } from '@psycron/components/availability/AvailabilityNavButton';
import { AvailabilityTodayButton } from '@psycron/components/availability/AvailabilityTodayButton';
import { Button } from '@psycron/components/button/Button';
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Edit,
	Filter,
	FilterFull,
} from '@psycron/components/icons';
import { Modal } from '@psycron/components/modal/Modal';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import useViewport from '@psycron/hooks/useViewport';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, isPast, isToday, parseISO } from 'date-fns';

import { DayHeaderPopover } from './day-header-popover/DayHeaderPopover';
import { AvailabilityWeekDrawer } from './drawer/AvailabilityWeekDrawer';
import { AvailabilityWeekFilters } from './filters/AvailabilityWeekFilters';
import { useAvailabilityWeekViewModel } from './hook/useAvailabilityWeekViewModel';
import { useBlockDay, useUnblockDay } from './hook/useDayActions';
import { AvailabilityWeekDesktopGrid } from './views/desktop-view/AvailabilityWeekDesktopGrid';
import { AvailabilityWeekMobileList } from './views/mobile-view/AvailabilityWeekMobileList';
import {
	ClosedDayModalBody,
	ClosedDayModalText,
	ClosedDayOptionButton,
	ClosedDayOptionDescription,
	ClosedDayOptionsGrid,
	ClosedDayOptionTitle,
	ClosedDaySlotButton,
	ClosedDaySlotsGrid,
	ClosedDayTimeRangeRow,
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
import {
	generateSlotStartTimes,
	parseDurationMinutes,
	parseTimeRange,
} from './AvailabilityWeekPage.utils';

const parseDebugNowMinutes = (value: string | null): number | null => {
	if (!value || !import.meta.env.DEV) return null;

	const match = value.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) return null;

	const hours = Number(match[1]);
	const minutes = Number(match[2]);

	if (
		Number.isNaN(hours) ||
		Number.isNaN(minutes) ||
		hours < 0 ||
		hours > 23 ||
		minutes < 0 ||
		minutes > 59
	) {
		return null;
	}

	return hours * 60 + minutes;
};

export const AvailabilityWeekPage = () => {
	const todayCardId = 'availability-week-mobile-today';
	const { t } = useTranslation();
	const { date } = useParams<{ date: string }>();
	const [searchParams] = useSearchParams();
	const { isMobile } = useViewport();
	const { showAlert } = useAlert();
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
	const [defaultBlockedDate, setDefaultBlockedDate] = useState<string | null>(
		null
	);
	const [defaultBlockedMode, setDefaultBlockedMode] =
		useState<AvailabilityDateOverrideMode>('FULL_DAY');
	const [overrideStartTime, setOverrideStartTime] = useState('09:00');
	const [overrideEndTime, setOverrideEndTime] = useState('17:00');
	const [selectedSpecificSlots, setSelectedSpecificSlots] = useState<string[]>(
		[]
	);
	const [shouldScrollToToday, setShouldScrollToToday] = useState(false);
	const debugNowMinutes = parseDebugNowMinutes(searchParams.get('debugNow'));

	const queryClient = useQueryClient();
	const therapistId = useTherapistId();

	const blockDay = useBlockDay(therapistId, () => {
		setDayPopoverDate(null);
	});
	const unblockDay = useUnblockDay(therapistId, () => {
		setDayPopoverDate(null);
	});
	const openClosedDay = useMutation({
		mutationFn: async () => {
			if (!defaultBlockedDate) {
				throw new Error('Missing override date');
			}

			if (defaultBlockedMode === 'FULL_DAY') {
				return createAvailabilityDateOverride({
					date: defaultBlockedDate,
					mode: 'FULL_DAY',
					therapistId,
				});
			}

			if (defaultBlockedMode === 'TIME_RANGE') {
				return createAvailabilityDateOverride({
					date: defaultBlockedDate,
					endTime: overrideEndTime,
					mode: 'TIME_RANGE',
					startTime: overrideStartTime,
					therapistId,
				});
			}

			return createAvailabilityDateOverride({
				date: defaultBlockedDate,
				mode: 'SPECIFIC_SLOTS',
				slotStartTimes: selectedSpecificSlots,
				therapistId,
			});
		},
		onError: () => {
			showAlert({
				message: t('availability.week.default-blocked-day.error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			showAlert({
				message: t('availability.week.default-blocked-day.success'),
				severity: 'success',
			});
			setDefaultBlockedDate(null);
			setSelectedSpecificSlots([]);
		},
	});

	const baseTimeRange = useMemo(() => {
		if (!availability?.timeRange) return null;
		try {
			return parseTimeRange(availability.timeRange);
		} catch {
			return null;
		}
	}, [availability?.timeRange]);

	const sessionDurationMinutes = useMemo(() => {
		if (!availability?.sessionDuration) return null;
		try {
			return parseDurationMinutes(availability.sessionDuration);
		} catch {
			return null;
		}
	}, [availability?.sessionDuration]);

	useEffect(() => {
		if (!defaultBlockedDate || !baseTimeRange) return;

		setDefaultBlockedMode('FULL_DAY');
		setOverrideStartTime(baseTimeRange.startTime);
		setOverrideEndTime(baseTimeRange.endTime);
		setSelectedSpecificSlots([]);
	}, [baseTimeRange, defaultBlockedDate]);

	const specificSlotOptions =
		baseTimeRange && sessionDurationMinutes
			? generateSlotStartTimes(
					baseTimeRange.startTime,
					baseTimeRange.endTime,
					sessionDurationMinutes
				)
			: [];

	const partialSlotOptions =
		sessionDurationMinutes && overrideStartTime < overrideEndTime
			? generateSlotStartTimes(
					overrideStartTime,
					overrideEndTime,
					sessionDurationMinutes
				)
			: [];

	const isClosedDayConfirmDisabled =
		!availability?.timeRange ||
		!availability?.sessionDuration ||
		(defaultBlockedMode === 'TIME_RANGE' && partialSlotOptions.length === 0) ||
		(defaultBlockedMode === 'SPECIFIC_SLOTS' && selectedSpecificSlots.length === 0);

	const handleDayHeaderClick = (dateStr: string) => {
		const dayDate = parseISO(dateStr);
		if (isPast(dayDate) && !isToday(dayDate)) return;
		if (getDaySlots(dayDate).length === 0) {
			setDefaultBlockedDate(dateStr);
			return;
		}
		setDayPopoverDate(dateStr);
	};

	const handleSlotClick = (slot: IWeekSlot) => setSelectedSlot(slot);

	const handleSpecificSlotToggle = (startTime: string) => {
		setSelectedSpecificSlots((current) =>
			current.includes(startTime)
				? current.filter((item) => item !== startTime)
				: [...current, startTime].sort()
		);
	};

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
				<Edit />
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

			{defaultBlockedDate && (
				<Modal
					openModal
					title={t('availability.week.default-blocked-day.title')}
					onClose={() => setDefaultBlockedDate(null)}
					cardActionsProps={{
						actionName: t('availability.week.default-blocked-day.confirm'),
						disabled: isClosedDayConfirmDisabled,
						hasSecondAction: true,
						loading: openClosedDay.isPending,
						onClick: () => openClosedDay.mutate(),
						secondAction: () => setDefaultBlockedDate(null),
						secondActionName: t('availability.week.drawer.cancel-back'),
					}}
				>
					<ClosedDayModalBody>
						<ClosedDayModalText>
							{t('availability.week.default-blocked-day.body', {
								day: format(parseISO(defaultBlockedDate), 'EEEE, MMMM d'),
							})}
						</ClosedDayModalText>

						<ClosedDayOptionsGrid>
							<ClosedDayOptionButton
								isSelected={defaultBlockedMode === 'FULL_DAY'}
								onClick={() => setDefaultBlockedMode('FULL_DAY')}
								type='button'
							>
								<ClosedDayOptionTitle>
									{t('availability.week.default-blocked-day.open-full-day')}
								</ClosedDayOptionTitle>
								<ClosedDayOptionDescription>
									{t(
										'availability.week.default-blocked-day.open-full-day-desc'
									)}
								</ClosedDayOptionDescription>
							</ClosedDayOptionButton>
							<ClosedDayOptionButton
								isSelected={defaultBlockedMode === 'TIME_RANGE'}
								onClick={() => setDefaultBlockedMode('TIME_RANGE')}
								type='button'
							>
								<ClosedDayOptionTitle>
									{t('availability.week.default-blocked-day.open-part-day')}
								</ClosedDayOptionTitle>
								<ClosedDayOptionDescription>
									{t(
										'availability.week.default-blocked-day.open-part-day-desc'
									)}
								</ClosedDayOptionDescription>
							</ClosedDayOptionButton>
							<ClosedDayOptionButton
								isSelected={defaultBlockedMode === 'SPECIFIC_SLOTS'}
								onClick={() => setDefaultBlockedMode('SPECIFIC_SLOTS')}
								type='button'
							>
								<ClosedDayOptionTitle>
									{t(
										'availability.week.default-blocked-day.open-specific-slots'
									)}
								</ClosedDayOptionTitle>
								<ClosedDayOptionDescription>
									{t(
										'availability.week.default-blocked-day.open-specific-slots-desc'
									)}
								</ClosedDayOptionDescription>
							</ClosedDayOptionButton>
						</ClosedDayOptionsGrid>

						{defaultBlockedMode === 'TIME_RANGE' && (
							<ClosedDayTimeRangeRow>
								<TextField
									fullWidth
									label={t(
										'availability.week.default-blocked-day.start-time'
									)}
									onChange={(e) => setOverrideStartTime(e.target.value)}
									type='time'
									value={overrideStartTime}
								/>
								<TextField
									fullWidth
									label={t('availability.week.default-blocked-day.end-time')}
									onChange={(e) => setOverrideEndTime(e.target.value)}
									type='time'
									value={overrideEndTime}
								/>
							</ClosedDayTimeRangeRow>
						)}

						{defaultBlockedMode === 'SPECIFIC_SLOTS' && (
							<ClosedDaySlotsGrid>
								{specificSlotOptions.map((slotStartTime) => (
									<ClosedDaySlotButton
										isSelected={selectedSpecificSlots.includes(slotStartTime)}
										key={slotStartTime}
										onClick={() => handleSpecificSlotToggle(slotStartTime)}
										type='button'
									>
										{slotStartTime}
									</ClosedDaySlotButton>
								))}
							</ClosedDaySlotsGrid>
						)}
					</ClosedDayModalBody>
				</Modal>
			)}

			{selectedSlot && (
				<AvailabilityWeekDrawer
					slot={selectedSlot}
					onClose={() => setSelectedSlot(null)}
				/>
			)}
		</PageLayout>
	);
};
