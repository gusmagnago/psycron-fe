import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import {
	blockAllSlotsInDay,
	unblockAllSlotsInDay,
} from '@psycron/api/user/availability';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useBlockDay = (
	therapistId: string,
	onSuccess?: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({
			availabilityDayId,
			blockReason,
		}: {
			availabilityDayId: string;
			blockReason?: string;
			dayDate: string;
		}) =>
			blockAllSlotsInDay({
				availabilityDayId,
				blockReason,
				therapistId,
			}),
		onError: () => {
			showAlert({
				message: t('availability.week.day-header.block-all-error'),
				severity: 'error',
			});
		},
		onSuccess: (data, variables) => {
			capture(PostHogEvent.AvailabilityDayBlocked, {
				blocked_count: data.blockedCount,
				day_date: variables.dayDate,
			});
			showAlert({
				message: t('availability.week.day-header.block-all-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onSuccess?.();
		},
	});

	return mutation;
};

export const useUnblockDay = (
	therapistId: string,
	onSuccess?: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({
			availabilityDayId,
		}: {
			availabilityDayId: string;
			dayDate: string;
		}) =>
			unblockAllSlotsInDay({
				availabilityDayId,
				therapistId,
			}),
		onError: () => {
			showAlert({
				message: t('availability.week.day-header.unblock-all-error'),
				severity: 'error',
			});
		},
		onSuccess: (data, variables) => {
			capture(PostHogEvent.AvailabilityDayUnblocked, {
				day_date: variables.dayDate,
				unblocked_count: data.unblockedCount,
			});
			showAlert({
				message: t('availability.week.day-header.unblock-all-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onSuccess?.();
		},
	});

	return mutation;
};
