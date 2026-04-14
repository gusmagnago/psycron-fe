import { useTranslation } from 'react-i18next';
import { getDateLocale } from '@psycron/utils/date/date.utils';
import { format } from 'date-fns';

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
	const isMergeResolution = conflict.actionTaken === 'MERGE_PATIENTS';
	const resolutionDetails = conflict.resolutionDetails;
	const fieldSnapshots = resolutionDetails?.fieldSnapshots ?? [];
	const dateLocale = getDateLocale(i18n.language);
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

			{isMergeResolution && fieldSnapshots.length ? (
				<ResolutionDetailGrid>
					{fieldSnapshots.map((snapshot) => {
						const sourceLabelKey =
							snapshot.source === 'secondary'
								? 'conflicts.resolution.sources.secondary'
								: 'conflicts.resolution.sources.primary';
						const sourcePatientName =
							snapshot.sourcePatientName || t('conflicts.detail.not-provided');
						const selectedValue =
							snapshot.value || t('conflicts.detail.not-provided');

						return (
							<ResolutionField key={snapshot.field}>
								<ResolutionFieldLabel>
									{t(`conflicts.merge-review.fields.${snapshot.field}`)}
								</ResolutionFieldLabel>
								<ResolutionFieldSource>
									{t(sourceLabelKey, { name: sourcePatientName })}
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
