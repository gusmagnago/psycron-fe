import { useTranslation } from 'react-i18next';
import type { CustomError } from '@psycron/api/error';
import { extendAvailability } from '@psycron/api/jupiter';
import { Button } from '@psycron/components/button/Button';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	ExtendBannerTitle,
	ExtendBannerWrapper,
} from './AvailabilityExtendBanner.styles';

export const AvailabilityExtendBanner = () => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const { availability } = useJupiterAvailabilityConfig();

	const recurrencePattern = availability?.recurrencePattern ?? 'MONTHLY';

	const extendMutation = useMutation({
		mutationFn: () => extendAvailability(recurrencePattern),
		onSuccess: () => {
			showAlert({
				message: t('availability.week.extend.success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
		},
		onError: (error: CustomError) => {
			showAlert({ message: error.message, severity: 'error' });
		},
	});

	return (
		<ExtendBannerWrapper>
			<ExtendBannerTitle>
				{t('availability.week.extend.title')}
			</ExtendBannerTitle>

			<Button
				disabled={!availability}
				loading={extendMutation.isPending}
				onClick={() => extendMutation.mutate()}
				small
				variant='contained'
			>
				{t('availability.week.extend.confirm')}
			</Button>
		</ExtendBannerWrapper>
	);
};
