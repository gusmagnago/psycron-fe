import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Filter,
} from '@psycron/components/icons';
import { useCalendarPrefs } from '@psycron/hooks/useCalendarPrefs';
import useViewport from '@psycron/hooks/useViewport';
import i18n from '@psycron/i18n';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { AVAILABILITYPATH } from '@psycron/pages/urls';
import {
	addWeeks,
	eachDayOfInterval,
	endOfWeek,
	format,
	isToday,
	parseISO,
	startOfWeek,
	subWeeks,
} from 'date-fns';

import { AvailabilityWeekDrawer } from './drawer/AvailabilityWeekDrawer';
import { AvailabilityWeekFilters } from './filters/AvailabilityWeekFilters';
import type { IWeekSlot, SlotStatus } from './AvailabilityWeekPage.mock';
import {
	MOCK_WEEK_DATA,
	TIME_SLOTS,
	WORKING_DAYS,
} from './AvailabilityWeekPage.mock';
import {
	DayHeader,
	DayName,
	DayNumber,
	FilterButton,
	LegendItem,
	LegendLabel,
	LegendSwatch,
	MobileDayCard,
	MobileDayCardHeader,
	MobileDayDate,
	MobileDayList,
	MobileDayName,
	MobileDaySlots,
	MobileEmptyDay,
	MobileEmptyDayText,
	MobileSlotCard,
	MobileSlotCount,
	MobileSlotPatient,
	MobileSlotTherapy,
	MobileSlotTime,
	NavButton,
	SlotCell,
	SlotCellEmpty,
	SlotPatientName,
	SlotTherapyType,
	TimeLabel,
	TimeLabelText,
	TodayButton,
	WeekCard,
	WeekFooter,
	WeekGrid,
	WeekGridWrapper,
	WeekHeader,
	WeekHeaderLeft,
	WeekHeaderRight,
	WeekMobileTitleBlock,
	WeekSubtitle,
	WeekTitle,
} from './AvailabilityWeekPage.styles';

const LEGEND_ITEMS: { labelKey: string; status: SlotStatus }[] = [
	{ status: 'available', labelKey: 'availability.week.legend-available' },
	{
		status: 'booked-jupiter',
		labelKey: 'availability.week.legend-booked-jupiter',
	},
	{
		status: 'booked-google',
		labelKey: 'availability.week.legend-booked-google',
	},
	{ status: 'cancelled', labelKey: 'availability.week.legend-cancelled' },
];

const isBookable = (status: SlotStatus) =>
	status === 'booked-jupiter' || status === 'booked-google';

const formatTimeRange = (startTime: string, durationMin: number) => {
	const [h, m] = startTime.split(':').map(Number);
	const endH = h + Math.floor(durationMin / 60);
	return `${startTime} - ${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const getDaySlots = (day: Date): IWeekSlot[] =>
	MOCK_WEEK_DATA[format(day, 'yyyy-MM-dd')] ?? [];

export const AvailabilityWeekPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { date } = useParams<{ date: string }>();
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

	const baseDate = date ? parseISO(date) : new Date();
	const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
	const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
	const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
	const workingDays = weekDays.filter((d) => WORKING_DAYS.includes(d.getDay()));

	const weekRange = `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;

	const allSessionTypes = useMemo(() => {
		const types = new Set<string>();
		weekDays.forEach((day) => {
			getDaySlots(day).forEach((slot) => {
				if (slot.therapyType) types.add(slot.therapyType);
			});
		});
		return Array.from(types).sort();
	}, [weekDays]);

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

	const goToPrevWeek = () =>
		navigate(
			`/${i18n.language}/${AVAILABILITYPATH}/week/${format(subWeeks(baseDate, 1), 'yyyy-MM-dd')}`
		);

	const goToNextWeek = () =>
		navigate(
			`/${i18n.language}/${AVAILABILITYPATH}/week/${format(addWeeks(baseDate, 1), 'yyyy-MM-dd')}`
		);

	const goToToday = () =>
		navigate(
			`/${i18n.language}/${AVAILABILITYPATH}/week/${format(new Date(), 'yyyy-MM-dd')}`
		);

	const handleSlotClick = (slot: IWeekSlot) => {
		if (isBookable(slot.status)) setSelectedSlot(slot);
	};

	const filterButton = (
		<FilterButton
			isActive={activeFilterCount > 0}
			onClick={(e) => setFilterAnchorEl(e.currentTarget as HTMLElement)}
			small
		>
			<Filter />
			{t('availability.week.filters')}
			{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
		</FilterButton>
	);

	// Shared nav controls — identical in both mobile and desktop layouts
	const prevButton = (
		<NavButton
			onClick={goToPrevWeek}
			aria-label={t('availability.week.prev-week')}
		>
			<ChevronLeft />
		</NavButton>
	);
	const nextButton = (
		<NavButton
			onClick={goToNextWeek}
			aria-label={t('availability.week.next-week')}
		>
			<ChevronRight />
		</NavButton>
	);
	const todayButton = (
		<TodayButton onClick={goToToday}>
			<Calendar />
			{t('availability.week.today')}
		</TodayButton>
	);

	return (
		<PageLayout title={t('availability.week.page-title')} isLoading={false}>
			<WeekCard>
				{isMobile ? (
					<>
						<WeekMobileTitleBlock>
							<WeekTitle>{t('availability.week.title')}</WeekTitle>
							<WeekSubtitle>{weekRange}</WeekSubtitle>
						</WeekMobileTitleBlock>
						<WeekHeader>
							{prevButton}
							{todayButton}
							{nextButton}
							{filterButton}
						</WeekHeader>
					</>
				) : (
					<WeekHeader>
						<WeekHeaderLeft>
							{prevButton}
							<div>
								<WeekTitle>{t('availability.week.title')}</WeekTitle>
								<WeekSubtitle>{weekRange}</WeekSubtitle>
							</div>
						</WeekHeaderLeft>
						<WeekHeaderRight>
							{todayButton}
							{nextButton}
							{filterButton}
						</WeekHeaderRight>
					</WeekHeader>
				)}

				{isMobile ? (
					<MobileDayList>
						{workingDays.map((day, _id) => {
							const daySlots = getVisibleDaySlots(day);
							return (
								<MobileDayCard key={`mobile-day-${day.toISOString() + _id}`}>
									<MobileDayCardHeader>
										<div>
											<MobileDayName>{format(day, 'EEEE')}</MobileDayName>
											<MobileDayDate
												sx={
													isToday(day)
														? { color: 'brand.purple', fontWeight: 700 }
														: undefined
												}
											>
												{format(day, 'MMMM d')}
											</MobileDayDate>
										</div>
										<MobileSlotCount>
											{daySlots.length}{' '}
											{daySlots.length === 1
												? t('availability.week.slot')
												: t('availability.week.slots')}
										</MobileSlotCount>
									</MobileDayCardHeader>
									<MobileDaySlots>
										{daySlots.length === 0 ? (
											<MobileEmptyDay>
												<MobileEmptyDayText>
													{t('availability.week.no-appointments')}
												</MobileEmptyDayText>
											</MobileEmptyDay>
										) : (
											daySlots.map((slot) => (
												<MobileSlotCard
													key={`mobile-dslot-${slot.id}`}
													slotStatus={slot.status}
													onClick={() => handleSlotClick(slot)}
													disableRipple={!isBookable(slot.status)}
												>
													<MobileSlotTime>
														{formatTimeRange(slot.startTime, slot.duration)}
													</MobileSlotTime>
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
												</MobileSlotCard>
											))
										)}
									</MobileDaySlots>
								</MobileDayCard>
							);
						})}
					</MobileDayList>
				) : (
					<WeekGridWrapper>
						<WeekGrid>
							<div style={{ height: 60 }} />

							{weekDays.map((day, _id) => {
								const isDisabled = !WORKING_DAYS.includes(day.getDay());
								return (
									<DayHeader
										key={`hd-${day.toISOString() + _id}`}
										isDisabled={isDisabled}
									>
										<DayName>{format(day, 'EEE')}</DayName>
										<DayNumber
											sx={isToday(day) ? { color: 'brand.purple' } : undefined}
										>
											{format(day, 'd')}
										</DayNumber>
									</DayHeader>
								);
							})}

							{TIME_SLOTS.map((time) => (
								<Fragment key={`time-slot-${time}`}>
									<TimeLabel>
										<TimeLabelText>{time}</TimeLabelText>
									</TimeLabel>
									{weekDays.map((day) => {
										const isDisabled = !WORKING_DAYS.includes(day.getDay());
										const daySlots = getVisibleDaySlots(day);
										const slot = isDisabled
											? null
											: (daySlots.find((s) => s.startTime === time) ?? null);
										if (!slot) {
											return (
												<SlotCellEmpty
													key={`slot-empty${day.toISOString()}-${time}`}
												/>
											);
										}
										return (
											<SlotCell
												key={`slot-cell-${day.toISOString()}-${time}`}
												slotStatus={slot.status}
												onClick={() => handleSlotClick(slot)}
												disableRipple={!isBookable(slot.status)}
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
							))}
						</WeekGrid>
					</WeekGridWrapper>
				)}

				<WeekFooter>
					{LEGEND_ITEMS.map(({ status, labelKey }) => (
						<LegendItem key={`${status}-${labelKey}`}>
							<LegendSwatch swatchStatus={status} />
							<LegendLabel>{t(labelKey)}</LegendLabel>
						</LegendItem>
					))}
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
