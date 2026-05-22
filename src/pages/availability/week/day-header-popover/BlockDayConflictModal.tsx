import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@psycron/components/modal/Modal';

import type { IWeekSlot } from '../AvailabilityWeekPage.types';

import {
	BookedSlotItem,
	BookedSlotList,
	BookedSlotTime,
	ConflictSummaryNote,
} from './BlockDayConflictModal.styles';

interface BlockDayConflictModalProps {
	availableCount: number;
	bookedSlots: IWeekSlot[];
	dayLabel: string;
	isLoading: boolean;
	onClose: () => void;
	onConfirm: () => void;
	open: boolean;
}

export const BlockDayConflictModal = ({
	availableCount,
	bookedSlots,
	dayLabel,
	isLoading,
	onClose,
	onConfirm,
	open,
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

	const title = step === 1
		? t('availability.week.block-conflict-modal.step1-title')
		: t('availability.week.block-conflict-modal.step2-title');

	const actionLabel = step === 1
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
		>
			{step === 1 ? (
				<>
					<ConflictSummaryNote>
						{t('availability.week.block-conflict-modal.step1-hint', {
							count: bookedSlots.length,
							day: dayLabel,
						})}
					</ConflictSummaryNote>
					<BookedSlotList>
						{bookedSlots.map((slot) => (
							<BookedSlotItem key={slot.id}>
								<BookedSlotTime>{slot.startTime}</BookedSlotTime>
								{slot.patientName ?? t('conflicts.detail.not-provided')}
							</BookedSlotItem>
						))}
					</BookedSlotList>
				</>
			) : (
				<ConflictSummaryNote>
					{t('availability.week.block-conflict-modal.step2-summary', {
						available: availableCount,
						conflicts: bookedSlots.length,
					})}
				</ConflictSummaryNote>
			)}
		</Modal>
	);
};
