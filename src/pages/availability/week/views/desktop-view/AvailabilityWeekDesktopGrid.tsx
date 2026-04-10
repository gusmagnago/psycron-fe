import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format, isBefore, isToday, startOfDay } from 'date-fns';

import { SlotBufferLabel } from '../../AvailabilityWeekPage.styles';
import type { IWeekSlot } from '../../AvailabilityWeekPage.types';
import {
	formatTimeRange,
	isClickable,
	isDayFullyBlocked,
} from '../../AvailabilityWeekPage.utils';

import {
	BlockedSlotHoverLabel,
	CancelledSlotHoverLabel,
	CurrentTimeLine,
	DayColumn,
	DayHeader,
	DayName,
	DayNumber,
	HalfHourGridLine,
	HourGridLine,
	SlotCell,
	SlotCellBuffer,
	SlotPatientName,
	SlotTherapyType,
	SlotTimeMeta,
	TimeAxis,
	TimeLabel,
	TimeLabelText,
	WeekGrid,
	WeekGridCorner,
	WeekGridWrapper,
} from './AvailabilityWeekDesktopGrid.styles';
import type { AvailabilityWeekDesktopGridProps } from './AvailabilityWeekDesktopGrid.types';
import {
	BUFFER_LABEL_MIN_HEIGHT,
	BUFFER_VERTICAL_GAP,
	buildTimelineMarks,
	DAY_HEADER_HEIGHT,
	FALLBACK_END_MINUTES,
	FALLBACK_START_MINUTES,
	formatMinutesToTimeLabel,
	getSlotEndMinutes,
	HALF_HOUR_INTERVAL_MINUTES,
	HOUR_INTERVAL_MINUTES,
	MIN_BUFFER_HEIGHT,
	MIN_SLOT_HEIGHT,
	parseTimeToMinutes,
	PIXELS_PER_MINUTE,
	SLOT_COMPACT_HEIGHT,
	SLOT_TEXT_MIN_HEIGHT,
	SLOT_VERTICAL_GAP,
} from './AvailabilityWeekDesktopGrid.utils';

export const AvailabilityWeekDesktopGrid = ({
	debugNowMinutes,
	getDaySlots,
	getVisibleDaySlots,
	onDayHeaderClick,
	onSlotClick,
	onSlotPointerDown,
	weekData,
	weekDays,
}: AvailabilityWeekDesktopGridProps) => {
	const { t } = useTranslation();
	const [now, setNow] = useState(() => new Date());

	const getCancelledHoverLabel = (triggeredBy?: IWeekSlot['triggeredBy']) => {
		if (triggeredBy === 'PATIENT') {
			return t('availability.week.drawer.cancelled-by-patient');
		}

		if (triggeredBy === 'THERAPIST') {
			return t('availability.week.drawer.cancelled-by-therapist');
		}

		return t('availability.week.legend-cancelled');
	};

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setNow(new Date());
		}, 60000);

		return () => window.clearInterval(intervalId);
	}, []);

	const timeline = useMemo(() => {
		const allSlots = Object.values(weekData).flat();

		if (allSlots.length === 0) {
			const totalMinutes = FALLBACK_END_MINUTES - FALLBACK_START_MINUTES;

			return {
				endMinute: FALLBACK_END_MINUTES,
				halfHourMarks: buildTimelineMarks(
					FALLBACK_START_MINUTES + HALF_HOUR_INTERVAL_MINUTES,
					FALLBACK_END_MINUTES - HALF_HOUR_INTERVAL_MINUTES,
					HOUR_INTERVAL_MINUTES
				),
				hourMarks: buildTimelineMarks(
					FALLBACK_START_MINUTES,
					FALLBACK_END_MINUTES,
					HOUR_INTERVAL_MINUTES
				),
				startMinute: FALLBACK_START_MINUTES,
				totalHeight: totalMinutes * PIXELS_PER_MINUTE,
			};
		}

		const earliestStart = Math.min(
			...allSlots.map((slot) => parseTimeToMinutes(slot.startTime))
		);
		const latestEnd = Math.max(...allSlots.map(getSlotEndMinutes));
		const startMinute =
			Math.floor(earliestStart / HOUR_INTERVAL_MINUTES) * HOUR_INTERVAL_MINUTES;
		const endMinute = Math.max(
			startMinute + HOUR_INTERVAL_MINUTES,
			Math.ceil(latestEnd / HOUR_INTERVAL_MINUTES) * HOUR_INTERVAL_MINUTES
		);
		const totalMinutes = endMinute - startMinute;

		return {
			endMinute,
			halfHourMarks: buildTimelineMarks(
				startMinute + HALF_HOUR_INTERVAL_MINUTES,
				endMinute - HALF_HOUR_INTERVAL_MINUTES,
				HOUR_INTERVAL_MINUTES
			),
			hourMarks: buildTimelineMarks(
				startMinute,
				endMinute,
				HOUR_INTERVAL_MINUTES
			),
			startMinute,
			totalHeight: totalMinutes * PIXELS_PER_MINUTE,
		};
	}, [weekData]);

	const getTopPosition = (minutes: number): number =>
		DAY_HEADER_HEIGHT + (minutes - timeline.startMinute) * PIXELS_PER_MINUTE;

	const getSlotVisualGap = (slot: IWeekSlot): number =>
		slot.status === 'buffer' ? BUFFER_VERTICAL_GAP : SLOT_VERTICAL_GAP;

	const getBlockHeight = (slot: IWeekSlot): number => {
		const proportionalHeight = slot.duration * PIXELS_PER_MINUTE;
		const visualGap = getSlotVisualGap(slot);

		if (slot.status === 'buffer') {
			return Math.max(proportionalHeight - visualGap, MIN_BUFFER_HEIGHT);
		}

		return Math.max(proportionalHeight - visualGap, MIN_SLOT_HEIGHT);
	};

	const getRenderableSlots = (day: Date): IWeekSlot[] =>
		[...getVisibleDaySlots(day)]
			.filter((slot) => isClickable(slot.status, day))
			.sort((a, b) => a.startTime.localeCompare(b.startTime));

	const currentMinutes =
		debugNowMinutes ?? now.getHours() * 60 + now.getMinutes();
	const isCurrentTimeVisible =
		currentMinutes >= timeline.startMinute &&
		currentMinutes <= timeline.endMinute;

	return (
		<WeekGridWrapper>
			<WeekGrid>
				<WeekGridCorner />

				{weekDays.map((day, index) => {
					const dateStr = format(day, 'yyyy-MM-dd');
					const isDisabled = !(dateStr in weekData);
					const isPastDay = isBefore(day, startOfDay(new Date()));
					const todayDay = isToday(day);
					const fullyBlocked =
						!isDisabled && isDayFullyBlocked(getDaySlots(day));

					return (
						<DayHeader
							columnIndex={index + 2}
							isInteractive={!isPastDay}
							key={`header-${day.toISOString()}`}
							isDisabled={isDisabled}
							isFullyBlocked={fullyBlocked}
							isPast={isPastDay}
							isToday={todayDay}
							onClick={!isPastDay ? () => onDayHeaderClick(dateStr) : undefined}
						>
							<DayName>{format(day, 'EEE')}</DayName>
							<DayNumber>{format(day, 'd')}</DayNumber>
						</DayHeader>
					);
				})}

				<TimeAxis timelineHeight={timeline.totalHeight + DAY_HEADER_HEIGHT}>
					{timeline.hourMarks.map((mark, index) => (
						<TimeLabel
							key={`time-label-${mark}`}
							isFirst={index === 0}
							top={getTopPosition(mark)}
						>
							<TimeLabelText>{formatMinutesToTimeLabel(mark)}</TimeLabelText>
						</TimeLabel>
					))}
				</TimeAxis>

				{weekDays.map((day, index) => {
					const dateStr = format(day, 'yyyy-MM-dd');
					const isDisabled = !(dateStr in weekData);
					const isPastDay = isBefore(day, startOfDay(new Date()));
					const todayDay = isToday(day);
					const fullyBlocked =
						!isDisabled && isDayFullyBlocked(getDaySlots(day));
					const daySlots = isDisabled ? [] : getRenderableSlots(day);

					return (
						<DayColumn
							columnIndex={index + 2}
							isInteractive={isDisabled && !isPastDay}
							key={`day-column-${day.toISOString()}`}
							isDisabled={isDisabled}
							isFullyBlocked={fullyBlocked}
							isPast={isPastDay}
							isToday={todayDay}
							onClick={isDisabled && !isPastDay ? () => onDayHeaderClick(dateStr) : undefined}
							timelineHeight={timeline.totalHeight + DAY_HEADER_HEIGHT}
						>
							{timeline.hourMarks.map((mark) => (
								<HourGridLine
									key={`hour-line-${dateStr}-${mark}`}
									top={getTopPosition(mark)}
								/>
							))}
							{timeline.halfHourMarks.map((mark) => (
								<HalfHourGridLine
									key={`half-hour-line-${dateStr}-${mark}`}
									top={getTopPosition(mark)}
								/>
							))}
							{todayDay && isCurrentTimeVisible ? (
								<CurrentTimeLine top={getTopPosition(currentMinutes)} />
							) : null}

							{daySlots.map((slot, slotIndex) => {
								const top =
									getTopPosition(parseTimeToMinutes(slot.startTime)) +
									getSlotVisualGap(slot) / 2;
								const blockHeight = getBlockHeight(slot);
								const isCompact = blockHeight < SLOT_COMPACT_HEIGHT;
								const canShowText = blockHeight >= SLOT_TEXT_MIN_HEIGHT;
								const stackOrder = daySlots.length - slotIndex;
								const showBookedTime =
									(slot.status === 'booked-jupiter' ||
										slot.status === 'booked-google') &&
									canShowText;

								if (slot.status === 'buffer' && slot.bufferFor) {
									return (
										<SlotCellBuffer
											key={`slot-buffer-${slot.id}`}
											blockHeight={blockHeight}
											bufferFor={slot.bufferFor}
											onClick={() => onSlotClick(slot)}
											onPointerDown={() => onSlotPointerDown(slot)}
											stackOrder={stackOrder}
											top={top}
										>
											{blockHeight >= BUFFER_LABEL_MIN_HEIGHT ? (
												<SlotBufferLabel>
													{blockHeight < SLOT_COMPACT_HEIGHT
														? `${slot.duration}m`
														: `${t('availability.week.buffer-label')} · ${slot.duration}m`}
												</SlotBufferLabel>
											) : null}
										</SlotCellBuffer>
									);
								}

								return (
									<SlotCell
										blockHeight={blockHeight}
										disableRipple={!isClickable(slot.status, day)}
										isCompact={isCompact}
										key={`slot-cell-${slot.id}`}
										onClick={() => onSlotClick(slot)}
										onPointerDown={() => onSlotPointerDown(slot)}
										stackOrder={stackOrder}
										slotStatus={slot.status}
										top={top}
									>
										{slot.status === 'blocked' ? (
											<BlockedSlotHoverLabel data-blocked-hover-label='true'>
												{t('availability.week.blocked-hover-label')}
											</BlockedSlotHoverLabel>
										) : null}
										{slot.status === 'cancelled' ? (
											<CancelledSlotHoverLabel data-cancelled-hover-label='true'>
												{getCancelledHoverLabel(slot.triggeredBy)}
											</CancelledSlotHoverLabel>
										) : null}
										{canShowText && slot.patientName ? (
											<>
												<SlotPatientName isCompact={isCompact}>
													{slot.patientName}
												</SlotPatientName>
												{showBookedTime ? (
													<SlotTimeMeta isCompact={isCompact}>
														{formatTimeRange(slot.startTime, slot.duration)}
													</SlotTimeMeta>
												) : null}
												{!isCompact && slot.therapyType ? (
													<SlotTherapyType isCompact={isCompact}>
														{slot.therapyType}
													</SlotTherapyType>
												) : null}
											</>
										) : null}
									</SlotCell>
								);
							})}
						</DayColumn>
					);
				})}
			</WeekGrid>
		</WeekGridWrapper>
	);
};
