import { Fragment, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import type { AvailabilityLegendItem } from '@psycron/components/availability/AvailabilityLegend';
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
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { useCalendarPrefs } from '@psycron/hooks/useCalendarPrefs';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import useViewport from '@psycron/hooks/useViewport';
import i18n from '@psycron/i18n';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import {
	AVAILABILITYPATH,
	AVAILABILITYSETTINGS,
	AVAILABILITYWEEK_BASE,
} from '@psycron/pages/urls';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	addWeeks,
	eachDayOfInterval,
	endOfWeek,
	format,
	isAfter,
	isBefore,
	isToday,
	parseISO,
	startOfWeek,
	subWeeks,
} from 'date-fns';

import { AvailabilityWeekDrawer } from './drawer/AvailabilityWeekDrawer';
import { AvailabilityWeekFilters } from './filters/AvailabilityWeekFilters';
import { AvailabilityExtendBanner } from './AvailabilityExtendBanner';
import {
	BUFFER_COLORS,
	DayHeader,
	DayName,
	DayNumber,
	FilterButton,
	MobileDayCard,
	MobileDayCardHeader,
	MobileDayDate,
	MobileDayList,
	MobileDayName,
	MobileDaySlots,
	MobileEmptyDay,
	MobileEmptyDayText,
	MobileExpandButton,
	MobileSlotBuffer,
	MobileSlotCard,
	MobileSlotCount,
	MobileSlotDetails,
	MobileSlotPatient,
	MobileSlotTherapy,
	MobileSlotTime,
	SLOT_COLORS,
	SlotBufferLabel,
	SlotCell,
	SlotCellBuffer,
	SlotCellEmpty,
	SlotPatientName,
	SlotTherapyType,
	TimeLabel,
	TimeLabelText,
	WeekCard,
	WeekFeaturesActions,
	WeekFeaturesWrapper,
	WeekFooter,
	WeekGrid,
	WeekGridCorner,
	WeekGridWrapper,
	WeekHeader,
	WeekNavRow,
	WeekSubtitle,
	WeekTitle,
} from './AvailabilityWeekPage.styles';
import type { IWeekSlot, SlotStatus } from './AvailabilityWeekPage.types';
import { useWeekSlots } from './useWeekSlots';

const LEGEND_STATUSES: { labelKey: string; status: SlotStatus }[] = [
	{ status: 'available', labelKey: 'availability.week.legend-available' },
	{
		status: 'booked-jupiter',
		labelKey: 'availability.week.legend-booked-jupiter',
	},
	{
		status: 'booked-google',
		labelKey: 'availability.week.legend-booked-google',
	},
	{ status: 'buffer', labelKey: 'availability.week.legend-buffer' },
	{ status: 'cancelled', labelKey: 'availability.week.legend-cancelled' },
];

const isClickable = (status: SlotStatus) =>
	status === 'booked-jupiter' ||
	status === 'booked-google' ||
	status === 'available';

const formatTimeRange = (startTime: string, durationMin: number) => {
	const [h, m] = startTime.split(':').map(Number);
	const totalEndMin = h * 60 + m + durationMin;
	const endH = Math.floor(totalEndMin / 60);
	const endM = totalEndMin % 60;
	return `${startTime} – ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
};

export const AvailabilityWeekPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { date } = useParams<{ date: string }>();
	const { firstDate, lastDate } = useAvailability();
	const { isMobile } = useViewport();
	const {
		activeFilterCount,
		clearFilters,
		prefs,
		toggleBookingSource,
		toggleDeliveryMode,
		toggleSessionType,
		toggleShowCancelledSlots,
		toggleShowFreeSlots,
		toggleTimeOfDay,
	} = useCalendarPrefs();

	const [selectedSlot, setSelectedSlot] = useState<IWeekSlot | null>(null);
	const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
		null
	);
	const [expandedDays, setExpandedDays] = useState<Set<string>>(
		() => new Set([format(new Date(), 'yyyy-MM-dd')])
	);

	const { availability } = useJupiterAvailabilityConfig();
	const bufferTimeMinutes = availability?.bufferTimeMinutes ?? 0;

	const baseDate = date ? parseISO(date) : new Date();
	const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
	const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
	const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

	const { weekData, isLoading, isAvailabilityDatesEmpty } = useWeekSlots(
		weekStart,
		weekEnd,
		bufferTimeMinutes
	);

	const workingDays = weekDays.filter(
		(d) => format(d, 'yyyy-MM-dd') in weekData
	);

	const getDaySlots = useCallback(
		(day: Date): IWeekSlot[] => weekData[format(day, 'yyyy-MM-dd')] ?? [],
		[weekData]
	);

	const weekRange = `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;

	const allSessionTypes = useMemo(() => {
		const types = new Set<string>();
		weekDays.forEach((day) => {
			getDaySlots(day).forEach((slot) => {
				if (slot.therapyType) types.add(slot.therapyType);
			});
		});
		return Array.from(types).sort();
	}, [weekDays, getDaySlots]);

	const timeSlots = useMemo(() => {
		const times = new Set<string>();
		Object.values(weekData).forEach((slots) =>
			slots.forEach((s) => times.add(s.startTime))
		);
		return Array.from(times).sort();
	}, [weekData]);

	const getVisibleDaySlots = (day: Date): IWeekSlot[] => {
		let slots = getDaySlots(day);

		if (!prefs.showFreeSlots)
			slots = slots.filter((s) => s.status !== 'available');
		if (!prefs.showCancelledSlots)
			slots = slots.filter((s) => s.status !== 'cancelled');

		if (prefs.bookingSources.length > 0) {
			slots = slots.filter((s) => {
				if (s.status === 'booked-jupiter')
					return prefs.bookingSources.includes('jupiter');
				if (s.status === 'booked-google')
					return prefs.bookingSources.includes('google');
				if (s.status === 'buffer' && s.bufferFor) {
					if (s.bufferFor === 'booked-jupiter')
						return prefs.bookingSources.includes('jupiter');
					if (s.bufferFor === 'booked-google')
						return prefs.bookingSources.includes('google');
				}
				return true;
			});
		}

		if (prefs.sessionTypes.length > 0) {
			slots = slots.filter(
				(s) => !s.therapyType || prefs.sessionTypes.includes(s.therapyType)
			);
		}

		if (prefs.deliveryModes.length > 0) {
			slots = slots.filter(
				(s) => !s.deliveryMode || prefs.deliveryModes.includes(s.deliveryMode)
			);
		}

		if (prefs.timeOfDay.length > 0) {
			slots = slots.filter((s) => {
				const hour = parseInt(s.startTime.split(':')[0], 10);
				return prefs.timeOfDay.some((band) => {
					if (band === 'morning') return hour >= 8 && hour < 12;
					if (band === 'afternoon') return hour >= 12 && hour < 17;
					return hour >= 17; // evening
				});
			});
		}

		return slots;
	};

	const firstISO = firstDate?.date ? parseISO(firstDate.date) : null;
	const lastISO = lastDate?.date ? parseISO(lastDate.date) : null;

	const canGoPrev = firstISO
		? isAfter(weekStart, startOfWeek(firstISO, { weekStartsOn: 1 }))
		: false;
	const canGoNext = lastISO
		? isBefore(weekStart, startOfWeek(lastISO, { weekStartsOn: 1 }))
		: false;

	const goToPrevWeek = () =>
		navigate(
			`/${i18n.language}/${AVAILABILITYWEEK_BASE}/${format(subWeeks(baseDate, 1), 'yyyy-MM-dd')}`
		);

	const goToNextWeek = () =>
		navigate(
			`/${i18n.language}/${AVAILABILITYWEEK_BASE}/${format(addWeeks(baseDate, 1), 'yyyy-MM-dd')}`
		);

	const COLLAPSED_SLOTS_LIMIT = 3;

	const toggleDayExpanded = (dateStr: string) => {
		setExpandedDays((prev) => {
			const next = new Set(prev);
			if (next.has(dateStr)) next.delete(dateStr);
			else next.add(dateStr);
			return next;
		});
	};

	const handleSlotClick = (slot: IWeekSlot) => setSelectedSlot(slot);

	const legendItems: AvailabilityLegendItem[] = LEGEND_STATUSES.map(
		({ status, labelKey }) => ({
			color:
				status === 'buffer'
					? BUFFER_COLORS['booked-jupiter']
					: SLOT_COLORS[status],
			label: t(labelKey),
			...(status === 'available' && { borderColor: palette.gray['02'] }),
			...(status === 'buffer' && { opacity: 0.4 }),
			...(status === 'cancelled' && { opacity: 0.5 }),
		})
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
			<Button
				small
				tertiary
				onClick={() => navigate(`/${i18n.language}/${AVAILABILITYPATH}`)}
			>
				<Calendar />
				{!isMobile ? t('components.agenda.month') : null}
			</Button>
			<Button
				small
				tertiary
				aria-label={t('availability.week.settings')}
				onClick={() => navigate(`/${i18n.language}/${AVAILABILITYSETTINGS}`)}
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
	const todayButton = <AvailabilityTodayButton iconOnly={isMobile} />;

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
							<Box>
								<WeekTitle>{t('availability.week.title')}</WeekTitle>
								<WeekSubtitle>{weekRange}</WeekSubtitle>
							</Box>
							{nextButton}
						</WeekNavRow>
						<WeekFeaturesActions>
							{filterButton}
							{todayButton}
							{isMobile && navButtons}
						</WeekFeaturesActions>
					</WeekFeaturesWrapper>
				</WeekHeader>

				{isAvailabilityDatesEmpty ? (
					<AvailabilityExtendBanner />
				) : isMobile ? (
					<MobileDayList>
						{workingDays.map((day, _id) => {
							const dateStr = format(day, 'yyyy-MM-dd');
							const todayDay = isToday(day);
							const allSlots = getVisibleDaySlots(day);
							const isExpanded = expandedDays.has(dateStr);
							const visibleSlots = isExpanded
								? allSlots
								: allSlots.slice(0, COLLAPSED_SLOTS_LIMIT);
							const hiddenCount = allSlots.length - COLLAPSED_SLOTS_LIMIT;
							return (
								<MobileDayCard
									key={`mobile-day-${day.toISOString() + _id}`}
									isToday={todayDay}
								>
									<MobileDayCardHeader>
										<div>
											<MobileDayName>{format(day, 'EEEE')}</MobileDayName>
											<MobileDayDate
												sx={
													todayDay
														? { color: 'brand.purple', fontWeight: 700 }
														: undefined
												}
											>
												{format(day, 'MMMM d')}
											</MobileDayDate>
										</div>
										<MobileSlotCount>
											{allSlots.length}{' '}
											{allSlots.length === 1
												? t('availability.week.slot')
												: t('availability.week.slots')}
										</MobileSlotCount>
									</MobileDayCardHeader>
									<MobileDaySlots>
										{allSlots.length === 0 ? (
											<MobileEmptyDay>
												<MobileEmptyDayText>
													{t('availability.week.no-appointments')}
												</MobileEmptyDayText>
											</MobileEmptyDay>
										) : (
											<>
												{visibleSlots.map((slot) => {
													if (slot.status === 'buffer' && slot.bufferFor) {
														return (
															<MobileSlotBuffer
																key={`mobile-buffer-${slot.id}`}
																bufferFor={slot.bufferFor}
															>
																<MobileSlotTime>
																	{slot.startTime}
																</MobileSlotTime>
																<SlotBufferLabel>
																	{t('availability.week.buffer-label')}
																</SlotBufferLabel>
															</MobileSlotBuffer>
														);
													}
													return (
														<MobileSlotCard
															key={`mobile-dslot-${slot.id}`}
															slotStatus={slot.status}
															onClick={() => handleSlotClick(slot)}
															disableRipple={!isClickable(slot.status)}
														>
															<MobileSlotTime>
																{formatTimeRange(slot.startTime, slot.duration)}
															</MobileSlotTime>
															<MobileSlotDetails>
																{slot.patientName && (
																	<MobileSlotPatient>
																		{slot.patientName}
																	</MobileSlotPatient>
																)}
																{slot.therapyType && (
																	<MobileSlotTherapy>
																		{slot.therapyType}
																	</MobileSlotTherapy>
																)}
															</MobileSlotDetails>
														</MobileSlotCard>
													);
												})}
												{allSlots.length > COLLAPSED_SLOTS_LIMIT && (
													<MobileExpandButton
														onClick={() => toggleDayExpanded(dateStr)}
													>
														{isExpanded
															? t('availability.week.collapse-day')
															: t('availability.week.expand-day', {
																	count: hiddenCount,
																})}
													</MobileExpandButton>
												)}
											</>
										)}
									</MobileDaySlots>
								</MobileDayCard>
							);
						})}
					</MobileDayList>
				) : (
					<WeekGridWrapper>
						<WeekGrid>
							<WeekGridCorner />

							{weekDays.map((day, _id) => {
								const isDisabled = !(format(day, 'yyyy-MM-dd') in weekData);
								const todayDay = isToday(day);
								return (
									<DayHeader
										key={`hd-${day.toISOString() + _id}`}
										isDisabled={isDisabled}
										isToday={todayDay}
									>
										<DayName>{format(day, 'EEE')}</DayName>
										<DayNumber>{format(day, 'd')}</DayNumber>
									</DayHeader>
								);
							})}

							{timeSlots.map((time, rowIndex) => {
								const isOddRow = rowIndex % 2 !== 0;
								return (
									<Fragment key={`time-slot-${time}`}>
										<TimeLabel>
											<TimeLabelText>{time}</TimeLabelText>
										</TimeLabel>
										{weekDays.map((day) => {
											const isDisabled = !(
												format(day, 'yyyy-MM-dd') in weekData
											);
											const todayDay = isToday(day);
											const daySlots = getVisibleDaySlots(day);
											const slot = isDisabled
												? null
												: (daySlots.find((s) => s.startTime === time) ?? null);

											if (!slot) {
												return (
													<SlotCellEmpty
														key={`slot-empty${day.toISOString()}-${time}`}
														isOddRow={isOddRow}
														isToday={todayDay}
													/>
												);
											}
											if (slot.status === 'buffer' && slot.bufferFor) {
												return (
													<SlotCellBuffer
														key={`slot-buffer-${day.toISOString()}-${time}`}
														bufferFor={slot.bufferFor}
													>
														<SlotBufferLabel>
															{t('availability.week.buffer-label')}
														</SlotBufferLabel>
													</SlotCellBuffer>
												);
											}
											return (
												<SlotCell
													key={`slot-cell-${day.toISOString()}-${time}`}
													slotStatus={slot.status}
													isOddRow={isOddRow}
													isToday={todayDay}
													onClick={() => handleSlotClick(slot)}
													disableRipple={!isClickable(slot.status)}
												>
													{slot.patientName && (
														<>
															<SlotPatientName>
																{slot.patientName}
															</SlotPatientName>
															<SlotTherapyType>
																{slot.therapyType}
															</SlotTherapyType>
														</>
													)}
												</SlotCell>
											);
										})}
									</Fragment>
								);
							})}
						</WeekGrid>
					</WeekGridWrapper>
				)}

				<WeekFooter>
					<AvailabilityLegend items={legendItems} />
					{!isMobile && (
						<Box sx={{ display: 'flex', gap: 1 }}>{navButtons}</Box>
					)}
				</WeekFooter>
			</WeekCard>

			<AvailabilityWeekFilters
				activeFilterCount={activeFilterCount}
				allSessionTypes={allSessionTypes}
				anchorEl={filterAnchorEl}
				onClearFilters={clearFilters}
				onClose={() => setFilterAnchorEl(null)}
				onToggleBookingSource={toggleBookingSource}
				onToggleDeliveryMode={toggleDeliveryMode}
				onToggleSessionType={toggleSessionType}
				onToggleShowCancelledSlots={toggleShowCancelledSlots}
				onToggleShowFreeSlots={toggleShowFreeSlots}
				onToggleTimeOfDay={toggleTimeOfDay}
				prefs={prefs}
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
