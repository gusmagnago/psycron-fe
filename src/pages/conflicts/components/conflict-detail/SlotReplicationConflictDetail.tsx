import { format } from 'date-fns';

import {
	ConflictMetaGroup,
	ConflictMetaLabel,
	ConflictMetaValue,
} from './styles/ConflictDetail.styles';
import type { SlotReplicationConflictDetailProps } from './types/ConflictDetail.types';

export const SlotReplicationConflictDetail = ({
	metadata,
	t,
}: SlotReplicationConflictDetailProps) => (
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
