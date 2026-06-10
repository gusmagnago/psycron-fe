import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@psycron/components/modal/Modal';

import {
	BookedSlotItem,
	BookedSlotList,
	BookedSlotTime,
	ConflictSummaryNote,
} from './BlockDayConflictModal.styles';
import type { BlockDayConflictModalProps } from './BlockDayConflictModal.types';

export const BlockDayConflictModal = ({
	availableCount,
	bookedSlots,
	dayLabel,
	isLoading,
	onClose,
	onConfirm,
	open,
	id,
}: BlockDayConflictModalProps) => {
	const { t } = useTranslation();
	const [step, setStep] = useState<1 | 2>(1);

	const handleClose = () => {
		setStep(1);
		onClose();
	};

	const handleConfirm = () => {
		if (step === 1) {
			setStep(2);
			return;
		}
		onConfirm();
	};

	const title =
		step === 1
			? t('availability.week.block-conflict-modal.step1-title')
			: t('availability.week.block-conflict-modal.step2-title');

	const actionLabel =
		step === 1
			? t('availability.week.block-conflict-modal.next')
			: t('availability.week.block-conflict-modal.confirm');

	return (
		<Modal
			openModal={open}
			title={title}
			onClose={handleClose}
			cardActionsProps={{
				actionName: actionLabel,
				hasSecondAction: true,
				loading: isLoading,
				onClick: handleConfirm,
				secondAction: handleClose,
				secondActionName: t('availability.week.drawer.cancel-back'),
			}}
			id={id}
		>
			{step === 1 ? (
				<>
					<ConflictSummaryNote
						id='conflict-summary-note'
						data-testid='conflict-summary-note'
					>
						{t('availability.week.block-conflict-modal.step1-hint', {
							count: bookedSlots.length,
							day: dayLabel,
						})}
					</ConflictSummaryNote>
					<BookedSlotList id='booked-slot-list' data-testid='booked-slot-list'>
						{bookedSlots.map((slot) => (
							<BookedSlotItem
								key={slot.id}
								id={`booked-slot-${slot.id}`}
								data-testid={`booked-slot-${slot.id}`}
							>
								<BookedSlotTime>{slot.startTime}</BookedSlotTime>
								{slot.patientName ?? t('conflicts.detail.not-provided')}
							</BookedSlotItem>
						))}
					</BookedSlotList>
				</>
			) : (
				<ConflictSummaryNote
					id='conflict-summary-note'
					data-testid='conflict-summary-note'
				>
					{t('availability.week.block-conflict-modal.step2-summary', {
						available: availableCount,
						conflicts: bookedSlots.length,
					})}
				</ConflictSummaryNote>
			)}
		</Modal>
	);
};
