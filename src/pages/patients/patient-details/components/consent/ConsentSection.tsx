import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import {
	getConsentRecords,
	revokeConsent,
} from '@psycron/api/patient/consent';
import type { ConsentPurpose } from '@psycron/api/patient/consent.types';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { formatLocalizedDate } from '@psycron/utils/date/date.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
	ConsentMeta,
	ConsentRow,
	ConsentSectionRoot,
	ConsentWarning,
} from './ConsentSection.styles';

const CONSENT_PURPOSES: ConsentPurpose[] = [
	'data_processing',
	'marketing_communications',
	'third_party_sharing',
];

interface ConsentSectionProps {
	patientId: string;
}

export const ConsentSection = ({ patientId }: ConsentSectionProps) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();
	const queryKey = ['patientConsent', patientId] as const;

	const { data, isLoading } = useQuery({
		enabled: Boolean(patientId),
		queryFn: () => getConsentRecords(patientId),
		queryKey,
	});

	const activeByPurpose = useMemo(() => {
		const active = new Map<ConsentPurpose, NonNullable<typeof data>['consent'][number]>();

		for (const record of data?.consent ?? []) {
			if (!record.revokedAt) active.set(record.purpose, record);
		}

		return active;
	}, [data?.consent]);

	const revokeMutation = useMutation({
		mutationFn: (purpose: ConsentPurpose) => revokeConsent(patientId, purpose),
		onSuccess: (_data, purpose) => {
			capture(PostHogEvent.ConsentRevoked, { purpose });
			void queryClient.invalidateQueries({ queryKey });
		},
	});

	const hasActiveConsent = activeByPurpose.size > 0;

	return (
		<ConsentSectionRoot>
			{!isLoading && !hasActiveConsent ? (
				<ConsentWarning>
					<Text variant='body2'>{t('consent.noConsentWarning')}</Text>
				</ConsentWarning>
			) : null}
			{CONSENT_PURPOSES.map((purpose) => {
				const active = activeByPurpose.get(purpose);

				return (
					<ConsentRow key={purpose}>
						<ConsentMeta>
							<Text fontWeight={600} variant='body2'>
								{t(`consent.purposes.${purpose}`)}
							</Text>
							<Text color='text.secondary' variant='caption'>
								{active
									? formatLocalizedDate(
											active.grantedAt,
											t('patients.list.not-available'),
											i18n.language
										)
									: t('consent.notGranted')}
							</Text>
						</ConsentMeta>
						<Button
							disabled={!active || revokeMutation.isPending}
							onClick={() => revokeMutation.mutate(purpose)}
							severity='error'
							variant='outlined'
						>
							{t('consent.revokeConsent')}
						</Button>
					</ConsentRow>
				);
			})}
		</ConsentSectionRoot>
	);
};
