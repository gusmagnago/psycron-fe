import type { IPatientDuplicateConflictMetadata } from '@psycron/api/user/conflicts/index.types';

import {
	ConflictMetaGroup,
	ConflictMetaLabel,
	ConflictMetaValue,
} from '../../ConflictsPage.styles';
import { getPatientDuplicateMatchLabel } from '../../ConflictsPage.utils';

interface PatientDuplicateConflictDetailProps {
	metadata: IPatientDuplicateConflictMetadata;
	t: (key: string) => string;
}

export const PatientDuplicateConflictDetail = ({
	metadata,
	t,
}: PatientDuplicateConflictDetailProps) => {
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
				<ConflictMetaValue>
					{getPatientDuplicateMatchLabel(metadata, t)}
				</ConflictMetaValue>
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
