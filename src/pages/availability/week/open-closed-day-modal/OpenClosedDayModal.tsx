import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { Modal } from '@psycron/components/modal/Modal';
import { format, parseISO } from 'date-fns';

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
} from './OpenClosedDayModal.styles';
import type { OpenClosedDayModalProps } from './OpenClosedDayModal.types';

export const OpenClosedDayModal = ({
	endTime,
	isConfirmDisabled,
	isLoading,
	mode,
	openDate,
	overrideSlotOptions,
	partialSlotOptions,
	selectedSpecificSlots,
	startTime,
	onClose,
	onConfirm,
	onEndTimeChange,
	onModeChange,
	onSpecificSlotToggle,
	onStartTimeChange,
}: OpenClosedDayModalProps) => {
	const { t } = useTranslation();

	if (!openDate) return null;

	return (
		<Modal
			openModal
			title={t('availability.week.default-blocked-day.title')}
			onClose={onClose}
			cardActionsProps={{
				actionName: t('availability.week.default-blocked-day.confirm'),
				disabled: isConfirmDisabled,
				hasSecondAction: true,
				loading: isLoading,
				onClick: onConfirm,
				secondAction: onClose,
				secondActionName: t('availability.week.drawer.cancel-back'),
			}}
		>
			<ClosedDayModalBody>
				<ClosedDayModalText>
					{t('availability.week.default-blocked-day.body', {
						day: format(parseISO(openDate), 'EEEE, MMMM d'),
					})}
				</ClosedDayModalText>

				<ClosedDayOptionsGrid>
					<ClosedDayOptionButton
						isSelected={mode === 'FULL_DAY'}
						onClick={() => onModeChange('FULL_DAY')}
						type='button'
					>
						<ClosedDayOptionTitle>
							{t('availability.week.default-blocked-day.open-full-day')}
						</ClosedDayOptionTitle>
						<ClosedDayOptionDescription>
							{t('availability.week.default-blocked-day.open-full-day-desc')}
						</ClosedDayOptionDescription>
					</ClosedDayOptionButton>

					<ClosedDayOptionButton
						isSelected={mode === 'TIME_RANGE'}
						onClick={() => onModeChange('TIME_RANGE')}
						type='button'
					>
						<ClosedDayOptionTitle>
							{t('availability.week.default-blocked-day.open-part-day')}
						</ClosedDayOptionTitle>
						<ClosedDayOptionDescription>
							{t('availability.week.default-blocked-day.open-part-day-desc')}
						</ClosedDayOptionDescription>
					</ClosedDayOptionButton>

					<ClosedDayOptionButton
						isSelected={mode === 'SPECIFIC_SLOTS'}
						onClick={() => onModeChange('SPECIFIC_SLOTS')}
						type='button'
					>
						<ClosedDayOptionTitle>
							{t('availability.week.default-blocked-day.open-specific-slots')}
						</ClosedDayOptionTitle>
						<ClosedDayOptionDescription>
							{t(
								'availability.week.default-blocked-day.open-specific-slots-desc'
							)}
						</ClosedDayOptionDescription>
					</ClosedDayOptionButton>
				</ClosedDayOptionsGrid>

				{mode === 'TIME_RANGE' && (
					<ClosedDayTimeRangeRow>
						<TextField
							fullWidth
							label={t('availability.week.default-blocked-day.start-time')}
							onChange={(e) => onStartTimeChange(e.target.value)}
							type='time'
							value={startTime}
						/>
						<TextField
							fullWidth
							label={t('availability.week.default-blocked-day.end-time')}
							onChange={(e) => onEndTimeChange(e.target.value)}
							type='time'
							value={endTime}
						/>
					</ClosedDayTimeRangeRow>
				)}

				{mode === 'SPECIFIC_SLOTS' && (
					<ClosedDaySlotsGrid>
						{overrideSlotOptions.map((slotStartTime) => (
							<ClosedDaySlotButton
								isSelected={selectedSpecificSlots.includes(slotStartTime)}
								key={slotStartTime}
								onClick={() => onSpecificSlotToggle(slotStartTime)}
								type='button'
							>
								{slotStartTime}
							</ClosedDaySlotButton>
						))}
					</ClosedDaySlotsGrid>
				)}

				{mode === 'TIME_RANGE' && partialSlotOptions.length === 0 && (
					<ClosedDayModalText>
						{t('availability.week.default-blocked-day.no-slots')}
					</ClosedDayModalText>
				)}
			</ClosedDayModalBody>
		</Modal>
	);
};
