import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { editSlot } from '@psycron/api/availability';
import { useAlert } from '@psycron/context/alert/AlertContext';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IAvailabilityWeekDrawerProps } from '../AvailabilityWeekDrawer.types';

export const useSlotAddress = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	specialty?: string
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const initialAddress = slot.address ?? null;
	const [address, setAddress] = useState<ISlotAddress | null>(initialAddress);

	const [letPatientChoose, setLetPatientChooseState] = useState(
		slot.letPatientChooseAddress ?? false
	);

	const isDirty =
		JSON.stringify(address) !== JSON.stringify(initialAddress);

	const mutation = useMutation({
		mutationFn: () =>
			editSlot({
				address,
				availabilityDayId: slot.availabilityDayId ?? '',
				slotId: slot._id ?? slot.id,
				therapistId: therapistId ?? '',
			}),
		onError: () => {
			showAlert({
				message: t('availability.week.drawer.address-save-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			showAlert({
				message: t('availability.week.drawer.address-saved'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
		},
	});

	const letPatientChooseMutation = useMutation({
		mutationFn: (val: boolean) =>
			editSlot({
				availabilityDayId: slot.availabilityDayId ?? '',
				letPatientChooseAddress: val,
				slotId: slot._id ?? slot.id,
				therapistId: therapistId ?? '',
			}),
		onError: () => {
			showAlert({
				message: t('availability.week.drawer.address-save-error'),
				severity: 'error',
			});
		},
		onSuccess: (_, val) => {
			capture(PostHogEvent.AvailabilityLetPatientChooseAddress, {
				enabled: val,
				source: 'drawer',
				specialty,
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
		},
	});

	const setLetPatientChoose = (val: boolean) => {
		setLetPatientChooseState(val);
		letPatientChooseMutation.mutate(val);
	};

	const clear = () => setAddress(null);

	return {
		address,
		clear,
		isDirty,
		letPatientChoose,
		mutation,
		setAddress,
		setLetPatientChoose,
	};
};
