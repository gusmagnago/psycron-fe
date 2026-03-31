import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { editSlot } from '@psycron/api/availability';
import { useAlert } from '@psycron/context/alert/AlertContext';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IAvailabilityWeekDrawerProps } from '../AvailabilityWeekDrawer.types';
import { computeEndTime } from '../AvailabilityWeekDrawer.utils';

export const useEditSlotForm = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	showAddress: boolean,
	onSaved: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const initialStartTime = slot.startTime;
	const initialEndTime = computeEndTime(slot.startTime, slot.duration);
	const initialNote = slot.notes ?? '';
	const initialAddress = slot.address ?? null;

	const [startTime, setStartTime] = useState(initialStartTime);
	const [endTime, setEndTime] = useState(initialEndTime);
	const [note, setNote] = useState(initialNote);
	const [address, setAddress] = useState<ISlotAddress | null>(initialAddress);

	const isDirty =
		startTime !== initialStartTime ||
		endTime !== initialEndTime ||
		note !== initialNote ||
		(showAddress && JSON.stringify(address) !== JSON.stringify(initialAddress));

	const mutation = useMutation({
		mutationFn: () =>
			editSlot({
				...(showAddress ? { address } : {}),
				availabilityDayId: slot.availabilityDayId ?? '',
				endTime,
				note: note || undefined,
				slotId: slot._id ?? slot.id,
				startTime,
				therapistId: therapistId ?? '',
			}),
		onError: () => {
			showAlert({
				message: t('availability.week.drawer.edit-error'),
				severity: 'error',
			});
		},
		onSuccess: (data) => {
			showAlert({
				message: data.wasBooked
					? t('availability.week.drawer.edit-success-booked')
					: t('availability.week.drawer.edit-success'),
				severity: data.wasBooked ? 'warning' : 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			queryClient.invalidateQueries({
				queryKey: ['slotAppointmentDetails', slot._id ?? slot.id],
			});
			onSaved();
		},
	});

	return {
		address,
		endTime,
		isDirty,
		mutation,
		note,
		setAddress,
		setEndTime,
		setNote,
		setStartTime,
		startTime,
	};
};
