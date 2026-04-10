import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';

import {
	ConflictActions,
	ConflictDescription,
	ConflictDetailHeader,
	ConflictDetailMetaRow,
	ConflictDetailPanel,
	ConflictMetaGrid,
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
import { PatientDuplicateConflictDetail } from './PatientDuplicateConflictDetail';
import { SlotReplicationConflictDetail } from './SlotReplicationConflictDetail';

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
			? (
					<PatientDuplicateConflictDetail metadata={conflict.metadata} t={t} />
				)
			: <SlotReplicationConflictDetail metadata={conflict.metadata} t={t} />;

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
