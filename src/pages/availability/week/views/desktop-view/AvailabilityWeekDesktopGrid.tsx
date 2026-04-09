import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { format, isToday } from 'date-fns';

import { SlotBufferLabel } from '../../AvailabilityWeekPage.styles';
import {
	isClickable,
	isDayFullyBlocked,
} from '../../AvailabilityWeekPage.utils';

import {
	DayHeader,
	DayName,
	DayNumber,
	SlotCell,
	SlotCellBuffer,
	SlotCellDisabled,
	SlotPatientName,
	SlotTherapyType,
	TimeLabel,
	TimeLabelText,
	WeekGrid,
	WeekGridCorner,
	WeekGridWrapper,
} from './AvailabilityWeekDesktopGrid.styles';
import type { AvailabilityWeekDesktopGridProps } from './AvailabilityWeekDesktopGrid.types';

export const AvailabilityWeekDesktopGrid = ({
	getDaySlots,
	getVisibleDaySlots,
	onDayHeaderClick,
	onSlotClick,
	onSlotPointerDown,
	timeSlots,
	weekData,
	weekDays,
}: AvailabilityWeekDesktopGridProps) => {
	const { t } = useTranslation();

	return (
		<WeekGridWrapper>
			<WeekGrid>
				<WeekGridCorner />

				{weekDays.map((day) => {
					const dateStr = format(day, 'yyyy-MM-dd');
					const isDisabled = !(dateStr in weekData);
					const todayDay = isToday(day);
					const fullyBlocked =
						!isDisabled && isDayFullyBlocked(getDaySlots(day));

					return (
						<DayHeader
							key={`header-${day.toISOString()}`}
							isDisabled={isDisabled}
							isFullyBlocked={fullyBlocked}
							isToday={todayDay}
							onClick={
									isDisabled
										? undefined
										: () => onDayHeaderClick(dateStr)
								}
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
								const isDisabled = !(format(day, 'yyyy-MM-dd') in weekData);
								const todayDay = isToday(day);
								const daySlots = getVisibleDaySlots(day);
								const slot = isDisabled
									? null
									: (daySlots.find((item) => item.startTime === time) ?? null);
								const shouldClick = isClickable(slot?.status, day);

								if (!slot || !shouldClick) {
									return (
										<SlotCellDisabled
											key={`slot-empty-${day.toISOString()}-${time}`}
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
											onClick={() => onSlotClick(slot)}
											onPointerDown={() => onSlotPointerDown(slot)}
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
										onClick={() => onSlotClick(slot)}
										onPointerDown={() => onSlotPointerDown(slot)}
										disableRipple={!shouldClick}
									>
										{slot.patientName && (
											<>
												<SlotPatientName>{slot.patientName}</SlotPatientName>
												<SlotTherapyType>{slot.therapyType}</SlotTherapyType>
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
	);
};
