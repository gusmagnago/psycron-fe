import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { QueueEmptyState } from '@psycron/components/queue-panel';
import { formatLocalizedDate } from '@psycron/utils/date/date.utils';

import {
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
import type { CancellationRecoveryDetailPanelProps } from '../CancellationRecoveryPage.types';
import {
	formatRecoveryDateTime,
	getCancelledByLabelKey,
	getDeliveryModeLabelKey,
	getRecoveryRowTitle,
	getRecoveryStateLabelKey,
	isReopenAvailable,
} from '../CancellationRecoveryPage.utils';

const DetailField = ({ label, value }: { label: string; value: string }) => (
	<DetailCard>
		<DetailLabel>{label}</DetailLabel>
		<DetailValue>{value}</DetailValue>
	</DetailCard>
);

export const CancellationRecoveryDetailPanel = ({
	isReopening,
	onOpenPatient,
	onRebook,
	onReopen,
	row,
}: CancellationRecoveryDetailPanelProps) => {
	const { i18n, t } = useTranslation();

	if (!row) {
		return (
			<DetailPanel>
				<QueueEmptyState
					message={t('availability.cancellation-recovery.empty-selection')}
				/>
			</DetailPanel>
		);
	}

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
				<Button
					disabled={!row.patientId}
					onClick={() => {
						if (!row.patientId) return;
						onRebook(row.patientId, row.slotId);
					}}
				>
					{t('availability.cancellation-recovery.actions.rebook')}
				</Button>
				<Button
					disabled={!row.patientId}
					onClick={() => {
						if (!row.patientId) return;
						onOpenPatient(row.patientId);
					}}
					secondary
				>
					{t('availability.cancellation-recovery.actions.open-patient')}
				</Button>
				<Button
					disabled={!isReopenAvailable(row) || isReopening}
					loading={isReopening}
					onClick={() => onReopen(row)}
					secondary
				>
					{t('availability.cancellation-recovery.actions.reopen')}
				</Button>
			</ActionsRow>
		</DetailPanel>
	);
};
