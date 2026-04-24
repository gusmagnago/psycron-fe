import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
	IPatientDuplicateConflictMetadata,
	ISlotReplicationConflictMetadata,
} from '@psycron/api/user/conflicts/index.types';
import { Button } from '@psycron/components/button/Button';
import { QueueEmptyState } from '@psycron/components/queue-detail';

import {
	ConflictDescription,
	ConflictStatusPill,
	ConflictTitle,
	ConflictTypeLabel,
} from '../../ConflictsPage.styles';
import {
	getConflictDisplayCopy,
	getConflictStatusLabel,
	getConflictTypeLabel,
} from '../../ConflictsPage.utils';

import {
	ConflictActionAlternatives,
	ConflictActionFooter,
	ConflictActionHeading,
	ConflictActionHint,
	ConflictActions,
	ConflictActionSection,
	ConflictDetailHeader,
	ConflictDetailMetaRow,
	ConflictDetailPanel,
	ConflictDetailSkeleton,
	ConflictDetailSkeletonBlock,
	ConflictDetailSkeletonRow,
	ConflictMetaGrid,
} from './styles/ConflictDetail.styles';
import type { ConflictDetailProps } from './types/ConflictDetail.types';
import { ConflictResolutionSummary } from './ConflictResolutionSummary';
import { PatientDuplicateConflictDetail } from './PatientDuplicateConflictDetail';
import { PatientDuplicateMergeReview } from './PatientDuplicateMergeReview';
import { SlotReplicationConflictDetail } from './SlotReplicationConflictDetail';

export const ConflictDetail = ({
	conflict,
	isUpdating,
	onUpdateConflict,
}: ConflictDetailProps) => {
	const { t } = useTranslation();
	const [isMergeReviewOpen, setIsMergeReviewOpen] = useState(false);

	useEffect(() => {
		setIsMergeReviewOpen(false);
	}, [conflict?._id]);

	if (!conflict) {
		return <QueueEmptyState message={t('conflicts.empty')} />;
	}

	const duplicateMetadata =
		conflict.type === 'PATIENT_DUPLICATE'
			? (conflict.metadata as IPatientDuplicateConflictMetadata)
			: null;
	const slotReplicationMetadata =
		conflict.type === 'SLOT_REPLICATION'
			? (conflict.metadata as ISlotReplicationConflictMetadata)
			: null;
	const metadata =
		conflict.type === 'PATIENT_DUPLICATE' && duplicateMetadata ? (
			<PatientDuplicateConflictDetail
				metadata={duplicateMetadata}
				shouldFetchCandidates={conflict.status === 'OPEN' && !isUpdating}
				t={t}
			/>
		) : (
			<SlotReplicationConflictDetail metadata={slotReplicationMetadata!} t={t} />
		);
	const canMergePatients =
		Boolean(duplicateMetadata?.candidatePatients[0]?._id) &&
		Boolean(duplicateMetadata?.candidatePatients[1]?._id);

	const actions =
		conflict.status !== 'OPEN' ? (
			<ConflictResolutionSummary conflict={conflict} />
		) : conflict.type === 'PATIENT_DUPLICATE' ? (
			<ConflictActions>
				<ConflictActionSection>
					<ConflictActionHeading>
						{t('conflicts.actions.recommended-title')}
					</ConflictActionHeading>
					<ConflictActionHint>
						{t('conflicts.actions.recommended-hint')}
					</ConflictActionHint>
					<Button
						fullWidth
						tertiary
						variant='contained'
						disabled={isUpdating || !canMergePatients}
						onClick={() => setIsMergeReviewOpen(true)}
					>
						{t('conflicts.actions.merge')}
					</Button>
				</ConflictActionSection>
				{isMergeReviewOpen && duplicateMetadata ? (
					<PatientDuplicateMergeReview
						metadata={duplicateMetadata}
						onCancel={() => setIsMergeReviewOpen(false)}
						onConfirm={({
							fieldSelections,
							primaryPatientId,
							secondaryPatientId,
						}) =>
							onUpdateConflict({
								actionTaken: 'MERGE_PATIENTS',
								conflictId: conflict._id,
								fieldSelections,
								primaryPatientId,
								secondaryPatientId,
								status: 'RESOLVED',
							})
						}
					/>
				) : null}
				<ConflictActionSection>
					<ConflictActionHeading>
						{t('conflicts.actions.alternatives-title')}
					</ConflictActionHeading>
					<ConflictActionHint>
						{t('conflicts.actions.alternatives-hint')}
					</ConflictActionHint>
					<ConflictActionAlternatives>
						<Button
							small
							secondary
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
							variant='outlined'
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
					</ConflictActionAlternatives>
				</ConflictActionSection>
				<ConflictActionFooter>
					<Button
						small
						tertiary
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
				</ConflictActionFooter>
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

	const displayCopy = getConflictDisplayCopy(conflict, t);

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
				<ConflictTitle>{displayCopy.title}</ConflictTitle>
				<ConflictDescription>{displayCopy.description}</ConflictDescription>
			</ConflictDetailHeader>
			{isUpdating ? (
				<ConflictDetailSkeleton>
					<ConflictDetailSkeletonRow>
						<ConflictDetailSkeletonBlock height={96} variant='rounded' />
						<ConflictDetailSkeletonBlock height={96} variant='rounded' />
					</ConflictDetailSkeletonRow>
					<ConflictDetailSkeletonRow>
						<ConflictDetailSkeletonBlock height={280} variant='rounded' />
						<ConflictDetailSkeletonBlock height={280} variant='rounded' />
					</ConflictDetailSkeletonRow>
					<ConflictDetailSkeletonRow>
						<ConflictDetailSkeletonBlock height={48} variant='rounded' />
						<ConflictDetailSkeletonBlock height={48} variant='rounded' />
						<ConflictDetailSkeletonBlock height={48} variant='rounded' />
					</ConflictDetailSkeletonRow>
				</ConflictDetailSkeleton>
			) : (
				<>
					<ConflictMetaGrid>{metadata}</ConflictMetaGrid>
					{actions}
				</>
			)}
		</ConflictDetailPanel>
	);
};
