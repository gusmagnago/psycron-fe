import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPatientById } from '@psycron/api/patient';
import type {
	PatientMergeField,
	PatientMergeFieldSelections,
	PatientMergeFieldSource,
} from '@psycron/api/user/conflicts/index.types';
import { Button } from '@psycron/components/button/Button';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { useQueries } from '@tanstack/react-query';

import {
	MergeReviewActions,
	MergeReviewField,
	MergeReviewFieldLabel,
	MergeReviewGrid,
	MergeReviewHeader,
	MergeReviewOption,
	MergeReviewOptionLabel,
	MergeReviewOptionValue,
	MergeReviewPanel,
	MergeReviewTitle,
} from './styles/ConflictDetail.styles';
import type { PatientDuplicateMergeReviewProps } from './types/ConflictDetail.types';
import {
	getPatientMergeFieldValue,
	getPatientName,
	PATIENT_DUPLICATE_MERGE_FIELDS,
} from './utils/ConflictDetail.utils';

export const PatientDuplicateMergeReview = ({
	metadata,
	onCancel,
	onConfirm,
}: PatientDuplicateMergeReviewProps) => {
	const { t } = useTranslation();
	const therapistId = useTherapistId();
	const [fieldSelections, setFieldSelections] =
		useState<PatientMergeFieldSelections>(() =>
			PATIENT_DUPLICATE_MERGE_FIELDS.reduce<PatientMergeFieldSelections>(
				(selections, field) => {
					selections[field] = 'primary';
					return selections;
				},
				{}
			)
		);

	const candidateQueries = useQueries({
		queries: metadata.candidatePatients.slice(0, 2).map((patient) => ({
			enabled: Boolean(therapistId && patient._id),
			queryFn: () => getPatientById(therapistId, patient._id),
			queryKey: ['conflictMergeCandidatePatient', therapistId, patient._id],
			staleTime: 1000 * 60 * 5,
		})),
	});

	const primaryPatient = candidateQueries[0]?.data ?? null;
	const secondaryPatient = candidateQueries[1]?.data ?? null;
	const isLoading = candidateQueries.some((query) => query.isLoading);
	const canConfirm = Boolean(primaryPatient?._id && secondaryPatient?._id);

	const updateFieldSelection = (
		field: PatientMergeField,
		source: PatientMergeFieldSource
	): void => {
		setFieldSelections((current) => ({
			...current,
			[field]: source,
		}));
	};

	return (
		<MergeReviewPanel>
			<MergeReviewHeader>
				<MergeReviewTitle>
					{t('conflicts.merge-review.title')}
				</MergeReviewTitle>
				<MergeReviewOptionValue>
					{t('conflicts.merge-review.description')}
				</MergeReviewOptionValue>
			</MergeReviewHeader>

			<MergeReviewGrid>
				{PATIENT_DUPLICATE_MERGE_FIELDS.map((field) => {
					const selectedSource = fieldSelections[field] ?? 'primary';
					const primaryValue =
						getPatientMergeFieldValue(field, primaryPatient) ??
						t('conflicts.detail.not-provided');
					const secondaryValue =
						getPatientMergeFieldValue(field, secondaryPatient) ??
						t('conflicts.detail.not-provided');

					return (
						<MergeReviewField key={field}>
							<MergeReviewFieldLabel>
								{t(`conflicts.merge-review.fields.${field}`)}
							</MergeReviewFieldLabel>
							<MergeReviewOption
								aria-checked={selectedSource === 'primary'}
								disabled={isLoading}
								role='radio'
								type='button'
								onClick={() => updateFieldSelection(field, 'primary')}
							>
								<MergeReviewOptionLabel>
									{t('conflicts.merge-review.primary', {
										name:
											getPatientName(primaryPatient) ||
											t('conflicts.detail.not-provided'),
									})}
								</MergeReviewOptionLabel>
								<MergeReviewOptionValue>{primaryValue}</MergeReviewOptionValue>
							</MergeReviewOption>
							<MergeReviewOption
								aria-checked={selectedSource === 'secondary'}
								disabled={isLoading}
								role='radio'
								type='button'
								onClick={() => updateFieldSelection(field, 'secondary')}
							>
								<MergeReviewOptionLabel>
									{t('conflicts.merge-review.secondary', {
										name:
											getPatientName(secondaryPatient) ||
											t('conflicts.detail.not-provided'),
									})}
								</MergeReviewOptionLabel>
								<MergeReviewOptionValue>{secondaryValue}</MergeReviewOptionValue>
							</MergeReviewOption>
						</MergeReviewField>
					);
				})}
			</MergeReviewGrid>

			<MergeReviewActions>
				<Button small secondary disabled={isLoading} onClick={onCancel}>
					{t('globals.cancel')}
				</Button>
				<Button
					small
					tertiary
					variant='contained'
					disabled={isLoading || !canConfirm}
					onClick={() =>
						onConfirm({
							fieldSelections,
							primaryPatientId: primaryPatient?._id ?? '',
							secondaryPatientId: secondaryPatient?._id ?? '',
						})
					}
				>
					{t('conflicts.merge-review.confirm')}
				</Button>
			</MergeReviewActions>
		</MergeReviewPanel>
	);
};
