import { useTranslation } from 'react-i18next';

import {
	CancelViewBody,
	SlotPickerChip,
	SlotPickerChipsRow,
	SlotPickerDateLabel,
	SlotPickerEmpty,
	SlotPickerGroup,
	SlotPickerList,
} from '../../AvailabilityWeekDrawer.styles';

import type { ISlotReschedulePickerProps } from './SlotReschedulePicker.types';

export const SlotReschedulePicker = ({
	availableSlotGroups,
	onSelectSlot,
	selectedSlot,
}: ISlotReschedulePickerProps) => {
	const { t } = useTranslation();

	return (
		<>
			<CancelViewBody>
				{t('availability.week.drawer.reschedule-select-prompt')}
			</CancelViewBody>
			<SlotPickerList>
				{availableSlotGroups.length === 0 && (
					<SlotPickerEmpty>
						{t('availability.week.drawer.reschedule-no-slots')}
					</SlotPickerEmpty>
				)}
				{availableSlotGroups.map((group) => (
					<SlotPickerGroup key={group.date}>
						<SlotPickerDateLabel>{group.formattedDate}</SlotPickerDateLabel>
						<SlotPickerChipsRow>
							{group.slots.map((s) => (
								<SlotPickerChip
									key={s.slotId}
									isSelected={selectedSlot?.slotId === s.slotId}
									onClick={() => onSelectSlot(s)}
								>
									{s.startTime}
								</SlotPickerChip>
							))}
						</SlotPickerChipsRow>
					</SlotPickerGroup>
				))}
			</SlotPickerList>
		</>
	);
};
