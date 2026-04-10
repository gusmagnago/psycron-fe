import { useTranslation } from 'react-i18next';
import type {
	IPatientDuplicateConflictMetadata,
	ISlotReplicationConflictMetadata,
} from '@psycron/api/user/conflicts/index.types';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { format } from 'date-fns';

import {
	ConflictActions,
	ConflictDescription,
	ConflictDetailHeader,
	ConflictDetailMetaRow,
	ConflictDetailPanel,
	ConflictMetaGrid,
	ConflictMetaGroup,
	ConflictMetaLabel,
	ConflictMetaValue,
	ConflictStatusPill,
	ConflictTitle,
	ConflictTypeLabel,
	EmptyState,
} from '../../ConflictsPage.styles';
import {
	getConflictStatusLabel,
	getConflictTypeLabel,
} from '../../ConflictsPage.utils';

import type { ConflictDetailProps } from './ConflictDetail.types';

const renderPatientDuplicateMetadata = (
	metadata: IPatientDuplicateConflictMetadata,
	t: (key: string) => string
) => {
	const incomingName = [
		metadata.incomingPatient?.firstName,
		metadata.incomingPatient?.lastName,
	]
		.filter(Boolean)
		.join(' ')
		.trim();

	return (
		<>
			<ConflictMetaGroup>
				<ConflictMetaLabel>{t('conflicts.detail.incoming-patient')}</ConflictMetaLabel>
				<ConflictMetaValue>
					{incomingName || t('conflicts.detail.not-provided')}
				</ConflictMetaValue>
			</ConflictMetaGroup>
			<ConflictMetaGroup>
				<ConflictMetaLabel>{t('conflicts.detail.matched-by')}</ConflictMetaLabel>
				<ConflictMetaValue>{metadata.match}</ConflictMetaValue>
			</ConflictMetaGroup>
			<ConflictMetaGroup>
				<ConflictMetaLabel>{t('conflicts.detail.candidate-records')}</ConflictMetaLabel>
				<ConflictMetaValue>
					{metadata.candidatePatients
						.map((patient) =>
							[patient.firstName, patient.lastName].filter(Boolean).join(' ')
						)
						.filter(Boolean)
						.join(', ') || t('conflicts.detail.not-provided')}
				</ConflictMetaValue>
			</ConflictMetaGroup>
		</>
	);
};

const renderSlotReplicationMetadata = (
	metadata: ISlotReplicationConflictMetadata,
	t: (key: string) => string
) => (
	<>
		<ConflictMetaGroup>
			<ConflictMetaLabel>{t('conflicts.detail.conflicting-date')}</ConflictMetaLabel>
			<ConflictMetaValue>
				{metadata.conflictingDate
					? format(new Date(metadata.conflictingDate), 'PPP')
					: t('conflicts.detail.not-provided')}
			</ConflictMetaValue>
		</ConflictMetaGroup>
		<ConflictMetaGroup>
			<ConflictMetaLabel>{t('conflicts.detail.conflicting-time')}</ConflictMetaLabel>
			<ConflictMetaValue>{metadata.conflictingStartTime}</ConflictMetaValue>
		</ConflictMetaGroup>
		<ConflictMetaGroup>
			<ConflictMetaLabel>{t('conflicts.detail.recurrence-pattern')}</ConflictMetaLabel>
			<ConflictMetaValue>
				{metadata.recurrencePattern ?? t('conflicts.detail.not-provided')}
			</ConflictMetaValue>
		</ConflictMetaGroup>
	</>
);

export const ConflictDetail = ({
	conflict,
	isUpdating,
	onUpdateConflict,
}: ConflictDetailProps) => {
	const { t } = useTranslation();

	if (!conflict) {
		return (
			<EmptyState>
				<Text>{t('conflicts.empty')}</Text>
			</EmptyState>
		);
	}

	const metadata =
		conflict.type === 'PATIENT_DUPLICATE'
			? renderPatientDuplicateMetadata(
					conflict.metadata as IPatientDuplicateConflictMetadata,
					t
				)
			: renderSlotReplicationMetadata(
					conflict.metadata as ISlotReplicationConflictMetadata,
					t
				);

	const actions =
		conflict.type === 'PATIENT_DUPLICATE' ? (
			<ConflictActions>
				<Button
					small
					disabled={isUpdating}
					onClick={() =>
						onUpdateConflict({
							actionTaken: 'KEEP_EXISTING_PATIENT',
							conflictId: conflict._id,
							status: 'RESOLVED',
						})
					}
				>
					{t('conflicts.actions.keep-existing')}
				</Button>
				<Button
					small
					disabled={isUpdating}
					onClick={() =>
						onUpdateConflict({
							actionTaken: 'KEEP_NEW_PATIENT',
							conflictId: conflict._id,
							status: 'RESOLVED',
						})
					}
				>
					{t('conflicts.actions.keep-new')}
				</Button>
				<Button
					small
					variant='outlined'
					disabled={isUpdating}
					onClick={() =>
						onUpdateConflict({
							actionTaken: 'DISMISSED',
							conflictId: conflict._id,
							status: 'DISMISSED',
						})
					}
				>
					{t('conflicts.actions.dismiss')}
				</Button>
			</ConflictActions>
		) : (
			<ConflictActions>
				<Button
					small
					disabled={isUpdating}
					onClick={() =>
						onUpdateConflict({
							actionTaken: 'MARKED_RESOLVED',
							conflictId: conflict._id,
							status: 'RESOLVED',
						})
					}
				>
					{t('conflicts.actions.mark-resolved')}
				</Button>
				<Button
					small
					variant='outlined'
					disabled={isUpdating}
					onClick={() =>
						onUpdateConflict({
							actionTaken: 'DISMISSED',
							conflictId: conflict._id,
							status: 'DISMISSED',
						})
					}
				>
					{t('conflicts.actions.dismiss')}
				</Button>
			</ConflictActions>
		);

	return (
		<ConflictDetailPanel>
			<ConflictDetailHeader>
				<ConflictDetailMetaRow>
					<ConflictTypeLabel>
						{getConflictTypeLabel(conflict.type, t)}
					</ConflictTypeLabel>
					<ConflictStatusPill>
						{getConflictStatusLabel(conflict.status, t)}
					</ConflictStatusPill>
				</ConflictDetailMetaRow>
				<ConflictTitle>{conflict.title}</ConflictTitle>
				<ConflictDescription>{conflict.description}</ConflictDescription>
			</ConflictDetailHeader>
			<ConflictMetaGrid>{metadata}</ConflictMetaGrid>
			{actions}
		</ConflictDetailPanel>
	);
};
