import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import {
	getConsentRecords,
	requestDataDeletion,
	revokeConsent,
} from '@psycron/api/patient/consent';
import type { ConsentPurpose } from '@psycron/api/patient/consent.types';
import { Button } from '@psycron/components/button/Button';
import { Modal } from '@psycron/components/modal/Modal';
import { Text } from '@psycron/components/text/Text';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { formatLocalizedDate } from '@psycron/utils/date/date.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
	ConsentList,
	ConsentRow,
	ConsentText,
	DeletionActions,
	PrivacySectionRoot,
} from './PatientPrivacySection.styles';

interface PatientPrivacySectionProps {
	patientId: string;
}

export const PatientPrivacySection = ({
	patientId,
}: PatientPrivacySectionProps) => {
	const { i18n, t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const [deletionModalOpen, setDeletionModalOpen] = useState(false);

	const queryKey = ['patientConsent', patientId] as const;
	const { data } = useQuery({
		enabled: Boolean(patientId),
		queryFn: () => getConsentRecords(patientId),
		queryKey,
	});

	const activeConsents = useMemo(
		() => (data?.consent ?? []).filter((record) => !record.revokedAt),
		[data?.consent]
	);

	const revokeMutation = useMutation({
		mutationFn: (purpose: ConsentPurpose) => revokeConsent(patientId, purpose),
		onSuccess: (_data, purpose) => {
			capture(PostHogEvent.ConsentRevoked, { purpose });
			void queryClient.invalidateQueries({ queryKey });
		},
	});

	const deletionMutation = useMutation({
		mutationFn: () => requestDataDeletion(patientId),
		onSuccess: () => {
			capture(PostHogEvent.DeletionRequested);
			setDeletionModalOpen(false);
			showAlert({
				message: t('consent.deletionRequested'),
				severity: 'success',
			});
		},
	});

	return (
		<PrivacySectionRoot>
			<Text variant='h6'>{t('consent.yourPrivacy')}</Text>
			<Text color='text.secondary' variant='body2'>
				{t('consent.activeConsents')}
			</Text>
			<ConsentList>
				{activeConsents.length ? (
					activeConsents.map((record) => (
						<ConsentRow key={`${record.purpose}-${record.grantedAt}`}>
							<ConsentText>
								<Text fontWeight={600} variant='body2'>
									{t(`consent.purposes.${record.purpose}`)}
								</Text>
								<Text color='text.secondary' variant='caption'>
									{formatLocalizedDate(
										record.grantedAt,
										t('patients.list.not-available'),
										i18n.language
									)}
								</Text>
							</ConsentText>
							<Button
								disabled={revokeMutation.isPending}
								onClick={() => revokeMutation.mutate(record.purpose)}
								severity='error'
								variant='outlined'
							>
								{t('consent.revokeConsent')}
							</Button>
						</ConsentRow>
					))
				) : (
					<Text color='text.secondary' variant='body2'>
						{t('consent.noActiveConsents')}
					</Text>
				)}
			</ConsentList>
			<DeletionActions>
				<Button onClick={() => setDeletionModalOpen(true)} severity='error'>
					{t('consent.requestDeletion')}
				</Button>
			</DeletionActions>
			<Modal
				cardActionsProps={{
					actionName: t('consent.deletionModal.confirm'),
					disabled: deletionMutation.isPending,
					hasSecondAction: true,
					onClick: () => deletionMutation.mutate(),
					secondAction: () => setDeletionModalOpen(false),
					secondActionName: t('common.cancel'),
				}}
				onClose={() => setDeletionModalOpen(false)}
				openModal={deletionModalOpen}
				title={t('consent.deletionModal.title')}
			>
				<Text variant='body2'>{t('consent.deletionModal.body')}</Text>
			</Modal>
		</PrivacySectionRoot>
	);
};
