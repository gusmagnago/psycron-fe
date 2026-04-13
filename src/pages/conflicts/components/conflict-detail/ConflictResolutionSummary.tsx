import { useTranslation } from 'react-i18next';
import { getPatientById } from '@psycron/api/patient';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { useQueries } from '@tanstack/react-query';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import {
	ResolutionDetailGrid,
	ResolutionField,
	ResolutionFieldLabel,
	ResolutionFieldSource,
	ResolutionPanel,
	ResolutionSummaryText,
	ResolutionTitle,
} from './styles/ConflictDetail.styles';
import type { ConflictResolutionSummaryProps } from './types/ConflictDetail.types';
import {
	getPatientMergeFieldValue,
	getPatientName,
	PATIENT_DUPLICATE_MERGE_FIELDS,
} from './utils/ConflictDetail.utils';

const getActionTranslationKey = (actionTaken?: string | null): string => {
	switch (actionTaken) {
		case 'AUTO_DISMISSED_STALE':
			return 'conflicts.resolution.actions.auto-dismissed-stale';
		case 'DISMISSED':
			return 'conflicts.resolution.actions.dismissed';
		case 'KEEP_EXISTING_PATIENT':
			return 'conflicts.resolution.actions.keep-existing';
		case 'KEEP_NEW_PATIENT':
			return 'conflicts.resolution.actions.keep-new';
		case 'MARKED_RESOLVED':
			return 'conflicts.resolution.actions.marked-resolved';
		case 'MERGE_PATIENTS':
			return 'conflicts.resolution.actions.merged';
		case 'MERGE_RECONCILED':
			return 'conflicts.resolution.actions.merge-reconciled';
		default:
			return 'conflicts.resolution.actions.unknown';
	}
};

export const ConflictResolutionSummary = ({
	conflict,
}: ConflictResolutionSummaryProps) => {
	const { i18n, t } = useTranslation();
	const therapistId = useTherapistId();
	const isMergeResolution = conflict.actionTaken === 'MERGE_PATIENTS';
	const resolutionDetails = conflict.resolutionDetails;
	const hasRecordedFieldSelections = Boolean(
		Object.keys(resolutionDetails?.fieldSelections ?? {}).length
	);
	const patientIds = [
		resolutionDetails?.primaryPatientId,
		resolutionDetails?.secondaryPatientId,
	].filter((patientId): patientId is string => Boolean(patientId));

	const patientQueries = useQueries({
		queries: patientIds.map((patientId) => ({
			enabled: Boolean(isMergeResolution && therapistId && patientId),
			queryFn: () => getPatientById(therapistId, patientId),
			queryKey: ['conflictResolutionPatient', therapistId, patientId],
			staleTime: 1000 * 60 * 5,
		})),
	});

	const primaryPatient = patientQueries[0]?.data ?? null;
	const secondaryPatient = patientQueries[1]?.data ?? null;
	const dateLocale = i18n.language === 'pt' ? ptBR : enUS;
	const resolvedAt = conflict.resolvedAt
		? format(new Date(conflict.resolvedAt), 'PPP p', { locale: dateLocale })
		: t('conflicts.detail.not-provided');

	return (
		<ResolutionPanel>
			<ResolutionTitle>{t('conflicts.resolution.title')}</ResolutionTitle>
			<ResolutionSummaryText>
				{t(getActionTranslationKey(conflict.actionTaken))}
			</ResolutionSummaryText>
			<ResolutionSummaryText>
				{t('conflicts.resolution.completed-at', { date: resolvedAt })}
			</ResolutionSummaryText>

			{isMergeResolution && hasRecordedFieldSelections ? (
				<ResolutionDetailGrid>
					{PATIENT_DUPLICATE_MERGE_FIELDS.map((field) => {
						const selectedSource =
							resolutionDetails?.fieldSelections?.[field] ?? 'primary';
						const selectedPatient =
							selectedSource === 'secondary' ? secondaryPatient : primaryPatient;
						const selectedPatientName =
							getPatientName(selectedPatient) ||
							t('conflicts.detail.not-provided');
						const selectedValue =
							getPatientMergeFieldValue(field, selectedPatient) ??
							t('conflicts.detail.not-provided');
						const sourceLabelKey =
							selectedSource === 'secondary'
								? 'conflicts.resolution.sources.secondary'
								: 'conflicts.resolution.sources.primary';

						return (
							<ResolutionField key={field}>
								<ResolutionFieldLabel>
									{t(`conflicts.merge-review.fields.${field}`)}
								</ResolutionFieldLabel>
								<ResolutionFieldSource>
									{t(sourceLabelKey, { name: selectedPatientName })}
								</ResolutionFieldSource>
								<ResolutionSummaryText>{selectedValue}</ResolutionSummaryText>
							</ResolutionField>
						);
					})}
				</ResolutionDetailGrid>
			) : null}
		</ResolutionPanel>
	);
};
