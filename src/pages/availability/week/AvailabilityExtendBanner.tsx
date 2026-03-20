import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, RadioGroup } from '@mui/material';
import type { CustomError } from '@psycron/api/error';
import { extendAvailability, type RecurrencePattern } from '@psycron/api/jupiter';
import { Button } from '@psycron/components/button/Button';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	ExtendBannerOption,
	ExtendBannerOptions,
	ExtendBannerTitle,
	ExtendBannerWrapper,
} from './AvailabilityExtendBanner.styles';

export const AvailabilityExtendBanner = () => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const [recurrencePattern, setRecurrencePattern] =
		useState<RecurrencePattern>('MONTHLY');

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

			<RadioGroup
				value={recurrencePattern}
				onChange={(e) =>
					setRecurrencePattern(e.target.value as RecurrencePattern)
				}
			>
				<ExtendBannerOptions>
					<ExtendBannerOption
						value='WEEKLY'
						control={<Radio size='small' />}
						label={t('availability.week.extend.end-of-month')}
					/>
					<ExtendBannerOption
						value='MONTHLY'
						control={<Radio size='small' />}
						label={t('availability.week.extend.end-of-year')}
					/>
				</ExtendBannerOptions>
			</RadioGroup>

			<Button
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
