import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
	AvailableSlotHoverLabel,
	BlockedSlotHoverLabel,
	CancelledSlotHoverLabel,
	CurrentTimeLine,
	DayColumn,
	DayHeader,
	DayName,
	DayNumber,
	HalfHourGridLine,
	HourGridLine,
	HourHitArea,
	HourHitLabel,
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
	activeDate,
	debugNowMinutes,
	getDaySlots,
	getVisibleDaySlots,
	onDayHeaderClick,
	onSlotClick,
	onSlotPointerDown,
	viewMode,
	weekData,
	weekDays,
}: AvailabilityWeekDesktopGridProps) => {
	const { t } = useTranslation();
	const [now, setNow] = useState(() => new Date());
	const [activeCellKey, setActiveCellKey] = useState<string | null>(null);

	const toRenderableText = (value: unknown): string => {
		if (typeof value === 'string' || typeof value === 'number') {
			return String(value);
		}

		return '';
	};

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

	const activeDateStr = format(activeDate, 'yyyy-MM-dd');
	const visibleWeekDays = useMemo(() => {
		if (viewMode === 'week') return weekDays;
		const activeDay = weekDays.find(
			(day) => format(day, 'yyyy-MM-dd') === activeDateStr
		);
		return activeDay ? [activeDay] : weekDays.slice(0, 1);
	}, [activeDateStr, viewMode, weekDays]);

	const getHourCellId = useCallback(
		(day: Date, mark: number): string =>
			`availability-hour-${format(day, 'EEE').toLowerCase()}-${formatMinutesToTimeLabel(mark).replace(':', '')}`,
		[]
	);

	const focusHourCell = useCallback((cellId: string): void => {
		setActiveCellKey(cellId);
		window.requestAnimationFrame(() => {
			document.getElementById(cellId)?.focus();
		});
	}, []);

	const getSlotTestId = (status: IWeekSlot['status']): string => {
		if (status === 'booked-jupiter') return 'availability-event-booked';
		if (status === 'booked-google') return 'availability-event-google';
		if (status === 'buffer') return 'availability-event-buffer';
		if (status === 'cancelled') return 'availability-event-cancelled';
		if (status === 'available') return 'availability-event-available';
		return 'availability-event-blocked';
	};

	const getSlotAriaLabel = (slot: IWeekSlot, day: Date): string => {
		const timeRange = formatTimeRange(slot.startTime, slot.duration);
		const dayLabel = format(day, 'EEEE, MMMM d');
		const patientName = toRenderableText(
			slot.patientName ?? slot.cancelledPatientName
		);

		if (slot.status === 'available') {
			return t('availability.week.slot-aria.available', {
				day: dayLabel,
				time: timeRange,
			});
		}

		if (slot.status === 'booked-google') {
			return t('availability.week.slot-aria.google', {
				day: dayLabel,
				time: timeRange,
			});
		}

		if (slot.status === 'booked-jupiter') {
			return t('availability.week.slot-aria.booked', {
				day: dayLabel,
				name: patientName || t('availability.week.slot-aria.patient'),
				time: timeRange,
			});
		}

		if (slot.status === 'cancelled') {
			return t('availability.week.slot-aria.cancelled', {
				day: dayLabel,
				name: patientName || t('availability.week.slot-aria.patient'),
				time: timeRange,
			});
		}

		if (slot.status === 'buffer') {
			return t('availability.week.slot-aria.buffer', {
				day: dayLabel,
				time: timeRange,
			});
		}

		return t('availability.week.slot-aria.blocked', {
			day: dayLabel,
			time: timeRange,
		});
	};

	const handleHourCellKeyDown = (
		event: ReactKeyboardEvent<HTMLButtonElement>,
		dayIndex: number,
		markIndex: number
	): void => {
		const lastDayIndex = visibleWeekDays.length - 1;
		const lastMarkIndex = timeline.hourMarks.length - 1;
		let nextDayIndex = dayIndex;
		let nextMarkIndex = markIndex;

		if (event.key === 'ArrowRight') nextDayIndex = Math.min(dayIndex + 1, lastDayIndex);
		else if (event.key === 'ArrowLeft') nextDayIndex = Math.max(dayIndex - 1, 0);
		else if (event.key === 'ArrowDown') nextMarkIndex = Math.min(markIndex + 1, lastMarkIndex);
		else if (event.key === 'ArrowUp') nextMarkIndex = Math.max(markIndex - 1, 0);
		else if (event.key === 'Home') nextDayIndex = 0;
		else if (event.key === 'End') nextDayIndex = lastDayIndex;
		else return;

		event.preventDefault();
		const nextDay = visibleWeekDays[nextDayIndex];
		const nextMark = timeline.hourMarks[nextMarkIndex];
		if (!nextDay || nextMark === undefined) return;

		focusHourCell(getHourCellId(nextDay, nextMark));
	};

	useEffect(() => {
		const firstDay = visibleWeekDays[0];
		const firstMark = timeline.hourMarks[0];
		if (!firstDay || firstMark === undefined) return;

		const availableCellIds = new Set(
			visibleWeekDays.flatMap((day) =>
				timeline.hourMarks.map((mark) => getHourCellId(day, mark))
			)
		);

		setActiveCellKey((current) =>
			current && availableCellIds.has(current)
				? current
				: getHourCellId(firstDay, firstMark)
		);
	}, [getHourCellId, timeline.hourMarks, visibleWeekDays]);

	const currentMinutes =
		debugNowMinutes ?? now.getHours() * 60 + now.getMinutes();
	const isCurrentTimeVisible =
		currentMinutes >= timeline.startMinute &&
		currentMinutes <= timeline.endMinute;

	return (
		<WeekGridWrapper>
			<WeekGrid
				aria-labelledby='availability-week-title'
				data-testid='availability-calendar-grid'
				dayCount={visibleWeekDays.length}
				id='availability-calendar-grid'
				role='grid'
			>
				<WeekGridCorner />

				{visibleWeekDays.map((day, index) => {
					const dateStr = format(day, 'yyyy-MM-dd');
					const isDisabled = !(dateStr in weekData);
					const isPastDay = isBefore(day, startOfDay(new Date()));
					const todayDay = isToday(day);
					const fullyBlocked =
						!isDisabled && isDayFullyBlocked(getDaySlots(day));

					return (
						<DayHeader
							aria-label={format(day, 'EEEE, MMMM d')}
							columnIndex={index + 2}
							isInteractive={!isPastDay}
							key={`header-${day.toISOString()}`}
							isDisabled={isDisabled}
							isFullyBlocked={fullyBlocked}
							isPast={isPastDay}
							isToday={todayDay}
							onClick={!isPastDay ? () => onDayHeaderClick(dateStr) : undefined}
							role='columnheader'
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

				{visibleWeekDays.map((day, index) => {
					const dateStr = format(day, 'yyyy-MM-dd');
					const isDisabled = !(dateStr in weekData);
					const isPastDay = isBefore(day, startOfDay(new Date()));
					const todayDay = isToday(day);
					const fullyBlocked =
						!isDisabled && isDayFullyBlocked(getDaySlots(day));
					const daySlots = isDisabled ? [] : getRenderableSlots(day);

					return (
						<DayColumn
							aria-label={format(day, 'EEEE, MMMM d')}
							columnIndex={index + 2}
							isInteractive={isDisabled && !isPastDay}
							key={`day-column-${day.toISOString()}`}
							isDisabled={isDisabled}
							isFullyBlocked={fullyBlocked}
							isPast={isPastDay}
							isToday={todayDay}
							onClick={isDisabled && !isPastDay ? () => onDayHeaderClick(dateStr) : undefined}
							role='row'
							timelineHeight={timeline.totalHeight + DAY_HEADER_HEIGHT}
						>
							{timeline.hourMarks.map((mark, markIndex) => {
								const cellId = getHourCellId(day, mark);
								const timeLabel = formatMinutesToTimeLabel(mark);

								return (
									<HourHitArea
										aria-label={t('availability.week.hour-action-aria', {
											day: format(day, 'EEEE, MMMM d'),
											time: timeLabel,
										})}
										data-testid={cellId}
										id={cellId}
										key={`hour-hit-${dateStr}-${mark}`}
										onClick={() => onDayHeaderClick(dateStr)}
										onFocus={() => setActiveCellKey(cellId)}
										onKeyDown={(event) =>
											handleHourCellKeyDown(event, index, markIndex)
										}
										role='gridcell'
										tabIndex={activeCellKey === cellId ? 0 : -1}
										top={getTopPosition(mark)}
										type='button'
									>
										<HourHitLabel data-hour-hit-label='true'>
											{t('availability.week.hour-action-label')}
										</HourHitLabel>
									</HourHitArea>
								);
							})}
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
									const patientName = toRenderableText(slot.patientName);
									const therapyType = toRenderableText(slot.therapyType);
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
											data-testid={getSlotTestId(slot.status)}
											aria-label={getSlotAriaLabel(slot, day)}
											onClick={() => onSlotClick(slot)}
											onPointerDown={() => onSlotPointerDown(slot)}
											role='gridcell'
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
										aria-label={getSlotAriaLabel(slot, day)}
										blockHeight={blockHeight}
										data-testid={getSlotTestId(slot.status)}
										disableRipple={!isClickable(slot.status, day)}
										isCompact={isCompact}
										key={`slot-cell-${slot.id}`}
										onClick={() => onSlotClick(slot)}
										onPointerDown={() => onSlotPointerDown(slot)}
										role='gridcell'
										stackOrder={stackOrder}
										slotStatus={slot.status}
										top={top}
									>
										{slot.status === 'available' ? (
											<AvailableSlotHoverLabel data-available-hover-label='true'>
												{t('availability.week.available-hover-label')}
											</AvailableSlotHoverLabel>
										) : null}
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
											{canShowText && patientName ? (
												<>
													<SlotPatientName isCompact={isCompact}>
														{patientName}
													</SlotPatientName>
													{showBookedTime ? (
														<SlotTimeMeta isCompact={isCompact}>
															{formatTimeRange(slot.startTime, slot.duration)}
														</SlotTimeMeta>
													) : null}
													{!isCompact && therapyType ? (
														<SlotTherapyType isCompact={isCompact}>
															{therapyType}
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
