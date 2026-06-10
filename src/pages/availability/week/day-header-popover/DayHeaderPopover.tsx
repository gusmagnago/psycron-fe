import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { Modal } from '@psycron/components/modal/Modal';

import { BlockDayConflictModal } from './BlockDayConflictModal';
import {
	BookedWarning,
	PopoverActions,
	PopoverContent,
	PopoverTitle,
	SummaryChip,
	SummaryRow,
} from './DayHeaderPopover.styles';
import type {
	IDayHeaderPopoverProps,
	IDaySummary,
} from './DayHeaderPopover.types';

export const DayHeaderPopover = ({
	dayLabel,
	isBlockDayPending,
	isPastDay,
	isUnblockDayPending,
	open,
	onBlockAll,
	onClose,
	onUnblockAll,
	slots,
}: IDayHeaderPopoverProps) => {
	const { t } = useTranslation();

	const [confirmAction, setConfirmAction] = useState<
		'block-all' | 'unblock-all' | null
	>(null);
	const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);

	const summary: IDaySummary = useMemo(() => {
		let available = 0;
		let blocked = 0;
		let booked = 0;
		let cancelled = 0;

		for (const slot of slots) {
			if (slot.status === 'available') available++;
			else if (slot.status === 'blocked') blocked++;
			else if (
				slot.status === 'booked-jupiter' ||
				slot.status === 'booked-google'
			)
				booked++;
			else if (slot.status === 'cancelled') cancelled++;
		}

		return { available, blocked, booked, cancelled, total: slots.length };
	}, [slots]);

	const handleConfirm = () => {
		if (confirmAction === 'block-all') onBlockAll();
		else if (confirmAction === 'unblock-all') onUnblockAll();
		setConfirmAction(null);
	};

	const bookedSlots = useMemo(
		() =>
			slots.filter(
				(s) => s.status === 'booked-jupiter' || s.status === 'booked-google'
			),
		[slots]
	);

	return (
		<>
			<BlockDayConflictModal
				id={`${dayLabel}-conflict-modal`}
				data-testid={`${dayLabel}-conflict-modal`}
				availableCount={summary.available}
				bookedSlots={bookedSlots}
				dayLabel={dayLabel}
				isLoading={isBlockDayPending}
				onClose={() => setIsConflictModalOpen(false)}
				onConfirm={() => {
					setIsConflictModalOpen(false);
					onBlockAll();
				}}
				open={isConflictModalOpen}
			/>
			<Modal
				openModal={open}
				title={dayLabel}
				onClose={onClose}
				cardActionsProps={{
					actionName: t('common.close'),
					onClick: onClose,
				}}
				id={`${dayLabel}-summary-modal`}
				data-testid={`${dayLabel}-summary-modal`}
			>
				<PopoverContent
					id={`${dayLabel}-summary-content`}
					data-testid={`${dayLabel}-summary-content`}
				>
					<PopoverTitle>
						{t('availability.week.day-header.actions')}
					</PopoverTitle>

					<SummaryRow
						id={`${dayLabel}-summary-row`}
						data-testid={`${dayLabel}-summary-row`}
					>
						<SummaryChip>
							{t('availability.week.day-header.summary', {
								cancelled: summary.cancelled,
								available: summary.available,
								blocked: summary.blocked,
								booked: summary.booked,
								total: summary.total,
							})}
						</SummaryChip>
					</SummaryRow>

					{summary.booked > 0 && summary.available > 0 && (
						<BookedWarning
							id={`${dayLabel}-booked-warning`}
							data-testid={`${dayLabel}-booked-warning`}
						>
							{t('availability.week.day-header.booked-warning', {
								count: summary.booked,
							})}
						</BookedWarning>
					)}

					<PopoverActions
						id={`${dayLabel}-popover-actions`}
						data-testid={`${dayLabel}-popover-actions`}
					>
						{summary.available > 0 && (
							<Button
								disabled={isBlockDayPending || isPastDay}
								loading={isBlockDayPending}
								onClick={() => {
									if (summary.booked > 0) {
										setIsConflictModalOpen(true);
									} else {
										setConfirmAction('block-all');
									}
								}}
								severity='error'
								small
								id={`${dayLabel}-block-all-button`}
								data-testid={`${dayLabel}-block-all-button`}
							>
								{t('availability.week.day-header.block-all')}
							</Button>
						)}
						{summary.blocked > 0 && (
							<Button
								disabled={isUnblockDayPending}
								loading={isUnblockDayPending}
								onClick={() => setConfirmAction('unblock-all')}
								small
								tertiary
								id={`${dayLabel}-unblock-all-button`}
								data-testid={`${dayLabel}-unblock-all-button`}
							>
								{t('availability.week.day-header.unblock-all')}
							</Button>
						)}
					</PopoverActions>
				</PopoverContent>
			</Modal>

			{confirmAction && (
				<Modal
					openModal
					title={
						confirmAction === 'block-all'
							? t('availability.week.day-header.block-all')
							: t('availability.week.day-header.unblock-all')
					}
					onClose={() => setConfirmAction(null)}
					cardActionsProps={{
						actionName:
							confirmAction === 'block-all'
								? t('availability.week.drawer.block-confirm')
								: t('availability.week.drawer.unblock-confirm'),
						hasSecondAction: true,
						onClick: handleConfirm,
						secondAction: () => setConfirmAction(null),
						secondActionName: t('availability.week.drawer.cancel-back'),
					}}
					id={`${dayLabel}-confirm-modal`}
					data-testid={`${dayLabel}-confirm-modal`}
				>
					{confirmAction === 'block-all'
						? t('availability.week.day-header.block-all-confirm', {
								count: summary.available,
								day: dayLabel,
							})
						: t('availability.week.day-header.unblock-all-confirm', {
								count: summary.blocked,
								day: dayLabel,
							})}
				</Modal>
			)}
		</>
	);
};
