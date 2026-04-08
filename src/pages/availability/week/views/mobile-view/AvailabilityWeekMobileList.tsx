import { useTranslation } from 'react-i18next';
import { Lock } from '@psycron/components/icons';
import { format } from 'date-fns';

import { SlotBufferLabel } from '../../AvailabilityWeekPage.styles';
import { formatTimeRange, isClickable } from '../../AvailabilityWeekPage.utils';

import {
	BlockDayButton,
	MobileDayCard,
	MobileDayCardHeader,
	MobileDayDate,
	MobileDayHeaderActions,
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
} from './AvailabilityWeekMobileList.styles';
import type { AvailabilityWeekMobileListProps } from './AvailabilityWeekMobileList.types';

export const AvailabilityWeekMobileList = ({
	days,
	todayCardId,
	onDayHeaderClick,
	onSlotClick,
	onSlotPointerDown,
	onToggleDayExpanded,
}: AvailabilityWeekMobileListProps) => {
	const { t } = useTranslation();

	return (
		<MobileDayList>
			{days.map((day) => {
				const showAvailableTimesButton =
					day.isFreeOnlyDay &&
					!day.isExpanded &&
					day.visibleSlots.length === 0 &&
					day.availableSlotCount > 0;
				const showExpandButton =
					!showAvailableTimesButton && (day.hiddenCount > 0 || day.isExpanded);

				return (
					<MobileDayCard
						id={day.isToday ? todayCardId : undefined}
						key={`mobile-day-${day.date.toISOString()}`}
						isFullyBlocked={day.fullyBlocked}
						isPastDay={day.isPastDay}
						isToday={day.isToday}
					>
						<MobileDayCardHeader>
							<div>
								<MobileDayName>{format(day.date, 'EEEE')}</MobileDayName>
								<MobileDayDate isToday={day.isToday}>
									{format(day.date, 'MMMM d')}
								</MobileDayDate>
							</div>
							<MobileDayHeaderActions>
								<MobileSlotCount>
									{day.allSlots.length}
									{day.allSlots.length === 1
										? t('availability.week.slot')
										: t('availability.week.slots')}
								</MobileSlotCount>
								<BlockDayButton
									aria-label={t('availability.week.day-header.actions')}
									disabled={day.isPastDay}
									onClick={(event: React.MouseEvent<HTMLElement>) =>
										onDayHeaderClick(event, day.dateStr)
									}
									small
									tertiary
								>
									<Lock />
								</BlockDayButton>
							</MobileDayHeaderActions>
						</MobileDayCardHeader>
						<MobileDaySlots>
							{day.allSlots.length === 0 ? (
								<MobileEmptyDay>
									<MobileEmptyDayText>
										{t('availability.week.no-appointments')}
									</MobileEmptyDayText>
								</MobileEmptyDay>
							) : (
								<>
									{showAvailableTimesButton && (
										<MobileExpandButton
											onClick={() => onToggleDayExpanded(day.dateStr)}
										>
											{t('availability.week.show-available-slots', {
												count: day.availableSlotCount,
											})}
										</MobileExpandButton>
									)}
									{day.visibleSlots.map((slot) => {
										const shouldClick = isClickable(slot.status, day.date);

										if (slot.status === 'buffer' && slot.bufferFor) {
											return (
												<MobileSlotBuffer
													key={`mobile-buffer-${slot.id}`}
													bufferFor={slot.bufferFor}
												>
													<MobileSlotTime>{slot.startTime}</MobileSlotTime>
													<SlotBufferLabel>
														{t('availability.week.buffer-label')}
													</SlotBufferLabel>
												</MobileSlotBuffer>
											);
										}

										return (
											<MobileSlotCard
												key={`mobile-slot-${slot.id}`}
												slotStatus={slot.status}
												onClick={() => (shouldClick ? onSlotClick(slot) : null)}
												onPointerDown={() =>
													shouldClick ? onSlotPointerDown(slot) : null
												}
												disableRipple={!shouldClick}
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
									{showExpandButton && (
										<MobileExpandButton
											disabled={day.fullyBlocked}
											onClick={() => onToggleDayExpanded(day.dateStr)}
										>
											{day.isExpanded
												? t('availability.week.collapse-day')
												: t('availability.week.expand-day', {
														count: day.hiddenCount,
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
	);
};
