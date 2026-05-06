import { getPatientById } from '@psycron/api/patient';
import type { IPatient } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { getPatientFullName } from '@psycron/utils/patient/patient.utils';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';

import { getPatientDuplicateMatchLabel } from '../../ConflictsPage.utils';

import {
	AdditionalCandidatesNote,
	ComparisonCard,
	ComparisonCardHeader,
	ComparisonCardTitle,
	ComparisonField,
	ComparisonFieldLabel,
	ComparisonFieldList,
	ComparisonFieldValue,
	ComparisonGrid,
	ConflictInlineNote,
	ConflictMetaGroup,
	ConflictMetaLabel,
	ConflictMetaSpan,
	ConflictMetaValue,
	DuplicateConflictLayout,
	DuplicateConflictTopGrid,
} from './styles/ConflictDetail.styles';
import type { PatientDuplicateConflictDetailProps } from './types/ConflictDetail.types';
import {
	getCandidatePatientNames,
	getConflictingDetails,
	getExtraCandidates,
	getIncomingPatientName,
	getPrimaryCandidate,
} from './utils/ConflictDetail.utils';

export const PatientDuplicateConflictDetail = ({
	metadata,
	shouldFetchCandidates = true,
	t,
}: PatientDuplicateConflictDetailProps) => {
	const therapistId = useTherapistId();
	const incomingName = getIncomingPatientName(metadata);

	const candidateQueries = useQueries({
		queries: metadata.candidatePatients.map((patient) => ({
			enabled: Boolean(shouldFetchCandidates && therapistId && patient._id),
			queryFn: async () => {
				try {
					return await getPatientById(therapistId ?? '', patient._id);
				} catch (error) {
					if (axios.isAxiosError(error) && error.response?.status === 404) {
						return null;
					}

					throw error;
				}
			},
			queryKey: ['conflictCandidatePatient', therapistId, patient._id],
			staleTime: 1000 * 60 * 5,
		})),
	});

	const detailedCandidates = shouldFetchCandidates
		? candidateQueries
		.map((query) => query.data)
		.filter((patient): patient is IPatient => Boolean(patient))
		: [];
	const primaryCandidate = getPrimaryCandidate(detailedCandidates);
	const extraCandidates = getExtraCandidates(detailedCandidates);
	const conflictingDetails = getConflictingDetails(metadata, t);
	const candidatePatientNames = getCandidatePatientNames(metadata);

	return (
		<ConflictMetaSpan>
			<DuplicateConflictLayout>
				<DuplicateConflictTopGrid>
					<ConflictMetaGroup>
						<ConflictMetaLabel>{t('conflicts.detail.matched-by')}</ConflictMetaLabel>
						<ConflictMetaValue>
							{getPatientDuplicateMatchLabel(metadata, t)}
						</ConflictMetaValue>
					</ConflictMetaGroup>
					<ConflictMetaGroup>
						<ConflictMetaLabel>
							{t('conflicts.detail.conflicting-details')}
						</ConflictMetaLabel>
						<ConflictMetaValue>
							{conflictingDetails.join(' • ') ||
								t('conflicts.detail.not-provided')}
						</ConflictMetaValue>
					</ConflictMetaGroup>
				</DuplicateConflictTopGrid>
				<ComparisonGrid>
					<ComparisonCard>
						<ComparisonCardHeader>
							<ConflictMetaLabel>
								{t('conflicts.detail.incoming-patient')}
							</ConflictMetaLabel>
							<ComparisonCardTitle>
								{incomingName || t('conflicts.detail.not-provided')}
							</ComparisonCardTitle>
						</ComparisonCardHeader>
						<ComparisonFieldList>
							<ComparisonField>
								<ComparisonFieldLabel>{t('globals.email')}</ComparisonFieldLabel>
								<ComparisonFieldValue>
									{metadata.contacts?.email ||
										t('conflicts.detail.not-provided')}
								</ComparisonFieldValue>
							</ComparisonField>
							<ComparisonField>
								<ComparisonFieldLabel>{t('globals.phone')}</ComparisonFieldLabel>
								<ComparisonFieldValue>
									{metadata.contacts?.phone ||
										t('conflicts.detail.not-provided')}
								</ComparisonFieldValue>
							</ComparisonField>
						</ComparisonFieldList>
					</ComparisonCard>

					<ComparisonCard>
						<ComparisonCardHeader>
							<ConflictMetaLabel>
								{t('conflicts.detail.existing-patient')}
							</ConflictMetaLabel>
							<ComparisonCardTitle>
								{primaryCandidate
									? getPatientFullName(primaryCandidate)
									: t('conflicts.detail.not-provided')}
							</ComparisonCardTitle>
						</ComparisonCardHeader>
						<ComparisonFieldList>
							<ComparisonField>
								<ComparisonFieldLabel>{t('globals.email')}</ComparisonFieldLabel>
								<ComparisonFieldValue>
									{primaryCandidate?.contacts?.email ||
										t('conflicts.detail.not-provided')}
								</ComparisonFieldValue>
							</ComparisonField>
							<ComparisonField>
								<ComparisonFieldLabel>{t('globals.phone')}</ComparisonFieldLabel>
								<ComparisonFieldValue>
									{primaryCandidate?.contacts?.phone ||
										t('conflicts.detail.not-provided')}
								</ComparisonFieldValue>
							</ComparisonField>
							<ComparisonField>
								<ComparisonFieldLabel>{t('globals.whatsapp')}</ComparisonFieldLabel>
								<ComparisonFieldValue>
									{primaryCandidate?.contacts?.whatsapp ||
										t('conflicts.detail.not-provided')}
								</ComparisonFieldValue>
							</ComparisonField>
							<ComparisonField>
								<ComparisonFieldLabel>
									{t('conflicts.detail.preferred-contact')}
								</ComparisonFieldLabel>
								<ComparisonFieldValue>
									{primaryCandidate?.preferredContact?.type ||
										t('conflicts.detail.not-provided')}
								</ComparisonFieldValue>
							</ComparisonField>
							<ComparisonField>
								<ComparisonFieldLabel>
									{t('patients.list.columns.timezone')}
								</ComparisonFieldLabel>
								<ComparisonFieldValue>
									{primaryCandidate?.timeZone ||
										t('conflicts.detail.not-provided')}
								</ComparisonFieldValue>
							</ComparisonField>
						</ComparisonFieldList>
					</ComparisonCard>
				</ComparisonGrid>
				<ConflictMetaGroup>
					<ConflictMetaLabel>
						{t('conflicts.detail.candidate-records')}
					</ConflictMetaLabel>
					<ConflictMetaValue>
						{candidatePatientNames.join(', ') ||
							t('conflicts.detail.not-provided')}
					</ConflictMetaValue>
				</ConflictMetaGroup>
				{extraCandidates.length ? (
					<AdditionalCandidatesNote>
						<ConflictInlineNote>
							{t('conflicts.detail.additional-candidates', {
								count: extraCandidates.length,
							})}
						</ConflictInlineNote>
					</AdditionalCandidatesNote>
				) : null}
			</DuplicateConflictLayout>
		</ConflictMetaSpan>
	);
};
