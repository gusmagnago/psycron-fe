import { format } from 'date-fns';

import {
	ConflictMetaGroup,
	ConflictMetaLabel,
	ConflictMetaValue,
} from './styles/ConflictDetail.styles';
import type { DayBlockConflictDetailProps } from './types/ConflictDetail.types';

export const DayBlockConflictDetail = ({
	metadata,
	t,
}: DayBlockConflictDetailProps) => (
	<>
		<ConflictMetaGroup>
			<ConflictMetaLabel>{t('conflicts.detail.appointment-date')}</ConflictMetaLabel>
			<ConflictMetaValue>
				{metadata.appointmentDate
					? format(new Date(metadata.appointmentDate), 'PPP')
					: t('conflicts.detail.not-provided')}
			</ConflictMetaValue>
		</ConflictMetaGroup>
		<ConflictMetaGroup>
			<ConflictMetaLabel>{t('conflicts.detail.appointment-time')}</ConflictMetaLabel>
			<ConflictMetaValue>
				{metadata.startTime}
				{metadata.endTime ? ` – ${metadata.endTime}` : ''}
			</ConflictMetaValue>
		</ConflictMetaGroup>
	</>
);
