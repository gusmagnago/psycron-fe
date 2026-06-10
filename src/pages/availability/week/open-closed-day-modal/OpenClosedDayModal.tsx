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
			id='open-closed-day-modal'
			data-testid='open-closed-day-modal'
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
			<ClosedDayModalBody
				id='open-closed-day-modal-body'
				data-testid='open-closed-day-modal-body'
			>
				<ClosedDayModalText>
					{t('availability.week.default-blocked-day.body', {
						day: format(parseISO(openDate), 'EEEE, MMMM d'),
					})}
				</ClosedDayModalText>

				<ClosedDayOptionsGrid
					id='closed-day-options-grid'
					data-testid='closed-day-options-grid'
				>
					<ClosedDayOptionButton
						isSelected={mode === 'FULL_DAY'}
						onClick={() => onModeChange('FULL_DAY')}
						type='button'
						id='full-day-option-button'
						data-testid='full-day-option-button'
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
						id='time-range-option-button'
						data-testid='time-range-option-button'
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
						id='specific-slots-option-button'
						data-testid='specific-slots-option-button'
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
					<ClosedDayTimeRangeRow
						id='closed-day-time-range-row'
						data-testid='closed-day-time-range-row'
					>
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
					<ClosedDaySlotsGrid
						id='closed-day-slots-grid'
						data-testid='closed-day-slots-grid'
					>
						{overrideSlotOptions.map((slotStartTime) => (
							<ClosedDaySlotButton
								id={`closed-day-slot-button-${slotStartTime}`}
								data-testid={`closed-day-slot-button-${slotStartTime}`}
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
					<ClosedDayModalText id='no-slots-text' data-testid='no-slots-text'>
						{t('availability.week.default-blocked-day.no-slots')}
					</ClosedDayModalText>
				)}
			</ClosedDayModalBody>
		</Modal>
	);
};
