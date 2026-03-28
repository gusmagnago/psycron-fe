import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { editSlot } from '@psycron/api/availability';
import { useAlert } from '@psycron/context/alert/AlertContext';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IAvailabilityWeekDrawerProps } from '../AvailabilityWeekDrawer.types';

export const useSlotAddress = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const initialAddress = slot.address ?? null;
	const [address, setAddress] = useState<ISlotAddress | null>(initialAddress);

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

	const clear = () => setAddress(null);

	return { address, clear, isDirty, mutation, setAddress };
};
