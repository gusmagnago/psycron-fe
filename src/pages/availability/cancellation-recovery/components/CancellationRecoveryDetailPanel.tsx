import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Tooltip } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Dots } from '@psycron/components/icons';
import { QueueEmptyState } from '@psycron/components/queue-panel';
import { formatLocalizedDate } from '@psycron/utils/date/date.utils';

import {
	ActionMenuButton,
	ActionMenuItem,
	ActionsRow,
	DetailCard,
	DetailEyebrow,
	DetailGrid,
	DetailHeader,
	DetailLabel,
	DetailPanel,
	DetailSubtitle,
	DetailTitle,
	DetailTitleRow,
	DetailValue,
	RecoveryStatePill,
} from '../CancellationRecoveryPage.styles';
import type { CancellationRecoveryRow } from '../CancellationRecoveryPage.types';
import type { CancellationRecoveryDetailPanelProps } from '../CancellationRecoveryPage.types';
import {
	formatRecoveryDateTime,
	getCancelledByLabelKey,
	getDeliveryModeLabelKey,
	getRecoveryRowTitle,
	getRecoveryStateLabelKey,
	isRecoveryStateResolved,
	isReopenAvailable,
} from '../CancellationRecoveryPage.utils';

const DetailField = ({ label, value }: { label: string; value: string }) => (
	<DetailCard>
		<DetailLabel>{label}</DetailLabel>
		<DetailValue>{value}</DetailValue>
	</DetailCard>
);

type RecoveryPrimaryAction =
	| {
			kind: 'archive' | 'rebook';
			labelKey: string;
	  }
	| null;

const getPrimaryAction = (
	row: CancellationRecoveryRow
): RecoveryPrimaryAction => {
	if (isRecoveryStateResolved(row.recoveryState)) return null;

	if (row.recoveryState === 'overdue' || !row.patientId) {
		return {
			kind: 'archive',
			labelKey: 'availability.cancellation-recovery.actions.archive',
		};
	}

	return {
		kind: 'rebook',
		labelKey: 'availability.cancellation-recovery.actions.rebook',
	};
};

export const CancellationRecoveryDetailPanel = ({
	isArchiving,
	isReopening,
	onArchive,
	onOpenPatient,
	onRebook,
	onReopen,
	row,
}: CancellationRecoveryDetailPanelProps) => {
	const { i18n, t } = useTranslation();
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

	if (!row) {
		return (
			<DetailPanel>
				<QueueEmptyState
					message={t('availability.cancellation-recovery.empty-selection')}
				/>
			</DetailPanel>
		);
	}

	const primaryAction = getPrimaryAction(row);
	const isResolved = isRecoveryStateResolved(row.recoveryState);
	const canArchive = !isResolved;
	const canOpenPatient = Boolean(row.patientId);
	const canReopen = isReopenAvailable(row);
	const hasMenuActions =
		canOpenPatient ||
		(canReopen && primaryAction?.kind !== 'archive') ||
		(canArchive && primaryAction?.kind !== 'archive');
	const closeMenu = () => setMenuAnchor(null);
	const openMenu = (event: MouseEvent<HTMLButtonElement>) =>
		setMenuAnchor(event.currentTarget);
	const handleArchive = () => {
		closeMenu();
		onArchive(row);
	};
	const handleOpenPatient = () => {
		closeMenu();
		if (!row.patientId) return;
		onOpenPatient(row.patientId);
	};
	const handleRebook = () => {
		closeMenu();
		onRebook(row);
	};
	const handleReopen = () => {
		closeMenu();
		onReopen(row);
	};

	return (
		<DetailPanel>
			<DetailHeader>
				<DetailEyebrow>
					{t('availability.cancellation-recovery.detail.eyebrow')}
				</DetailEyebrow>
				<DetailTitleRow>
					<DetailTitle>
						{getRecoveryRowTitle(row) ||
							t('availability.cancellation-recovery.unknown-patient')}
					</DetailTitle>
					<RecoveryStatePill state={row.recoveryState}>
						{t(getRecoveryStateLabelKey(row.recoveryState))}
					</RecoveryStatePill>
				</DetailTitleRow>
				<DetailSubtitle>
					{formatRecoveryDateTime(row, i18n.language)}
				</DetailSubtitle>
			</DetailHeader>

			<DetailGrid>
				<DetailField
					label={t('availability.cancellation-recovery.detail.cancelled-at')}
					value={formatLocalizedDate(
						row.canceledAt,
						t('patients.list.not-available'),
						i18n.language,
						'PPP p'
					)}
				/>
				<DetailField
					label={t('availability.cancellation-recovery.detail.cancelled-by')}
					value={t(getCancelledByLabelKey(row.triggeredBy))}
				/>
				<DetailField
					label={t('availability.cancellation-recovery.detail.reason')}
					value={`${
						row.reasonCode
							? t(`globals.cancellation-reason.${row.reasonCode}`)
							: t('availability.cancellation-recovery.detail.not-provided')
					}${row.customReason ? ` · ${row.customReason}` : ''}`}
				/>
				<DetailField
					label={t('availability.cancellation-recovery.detail.delivery')}
					value={t(getDeliveryModeLabelKey(row.deliveryMode))}
				/>
				<DetailField
					label={t('availability.cancellation-recovery.detail.patient')}
					value={
						row.patientName ||
						row.cancelledPatientName ||
						t('availability.cancellation-recovery.unknown-patient')
					}
				/>
				<DetailField
					label={t('availability.cancellation-recovery.detail.recovery-state')}
					value={`${t(getRecoveryStateLabelKey(row.recoveryState))}${
						row.reopenedAt
							? ` · ${formatLocalizedDate(row.reopenedAt, '', i18n.language, 'PPP p')}`
							: ''
					}`}
				/>
				{row.followedUpAt ? (
					<DetailField
						label={t(
							'availability.cancellation-recovery.detail.followed-up-at',
							'Followed up at'
						)}
						value={formatLocalizedDate(
							row.followedUpAt,
							t('patients.list.not-available'),
							i18n.language,
							'PPP p'
						)}
					/>
				) : null}
				{row.rebookedAppointmentId ? (
					<DetailField
						label={t(
							'availability.cancellation-recovery.detail.rebooked-appointment',
							'Rebooked appointment'
						)}
						value={row.rebookedAppointmentId}
					/>
				) : null}
			</DetailGrid>

			<ActionsRow>
				{primaryAction?.kind === 'rebook' ? (
					<Button disabled={!row.patientId} onClick={handleRebook}>
						{t(primaryAction.labelKey)}
					</Button>
				) : null}
				{primaryAction?.kind === 'archive' ? (
					<Button
						loading={isArchiving}
						onClick={handleArchive}
						secondary
					>
						{t(primaryAction.labelKey)}
					</Button>
				) : null}
				{hasMenuActions ? (
					<>
						<Tooltip
							title={t('availability.cancellation-recovery.actions.more')}
						>
							<ActionMenuButton
								aria-label={t(
									'availability.cancellation-recovery.actions.more'
								)}
								aria-controls={
									menuAnchor ? 'cancellation-recovery-actions-menu' : undefined
								}
								aria-expanded={Boolean(menuAnchor)}
								aria-haspopup='menu'
								onClick={openMenu}
							>
								<Dots />
							</ActionMenuButton>
						</Tooltip>
						<Menu
							anchorEl={menuAnchor}
							anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
							id='cancellation-recovery-actions-menu'
							onClose={closeMenu}
							open={Boolean(menuAnchor)}
							transformOrigin={{ horizontal: 'right', vertical: 'top' }}
						>
							{canOpenPatient ? (
								<ActionMenuItem onClick={handleOpenPatient}>
									{t('availability.cancellation-recovery.actions.open-patient')}
								</ActionMenuItem>
							) : null}
							{canReopen ? (
								<ActionMenuItem
									disabled={isReopening}
									onClick={handleReopen}
								>
									{t('availability.cancellation-recovery.actions.reopen')}
								</ActionMenuItem>
							) : null}
							{canArchive && primaryAction?.kind !== 'archive' ? (
								<ActionMenuItem
									disabled={isArchiving}
									onClick={handleArchive}
								>
									{t('availability.cancellation-recovery.actions.archive')}
								</ActionMenuItem>
							) : null}
						</Menu>
					</>
				) : null}
			</ActionsRow>
		</DetailPanel>
	);
};
