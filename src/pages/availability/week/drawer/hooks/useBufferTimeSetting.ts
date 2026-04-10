import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateAvailabilitySettings } from '@psycron/api/availability';
import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { JUPITER_AVAILABILITY_CONFIG_KEY } from '@psycron/hooks/useJupiterAvailabilityConfig';
import {
	getBufferInputValue,
	isBufferMinutesValid,
} from '@psycron/pages/availability/components/buffer-time-editor/BufferTimeEditor.utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IUseBufferTimeSettingReturn {
	bufferInput: string;
	isValid: boolean;
	removeMutation: { isPending: boolean; mutate: () => void };
	reset: () => void;
	saveMutation: { isPending: boolean; mutate: () => void };
	setBufferInput: (value: string) => void;
}

export const useBufferTimeSetting = (
	currentBufferMinutes: number,
	onSuccess: () => void
): IUseBufferTimeSettingReturn => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const [bufferInput, setBufferInput] = useState(
		getBufferInputValue(currentBufferMinutes)
	);

	useEffect(() => {
		setBufferInput(getBufferInputValue(currentBufferMinutes));
	}, [currentBufferMinutes]);

	const handleSuccess = (updated: IAvailabilityRecord) => {
		queryClient.setQueryData<IAvailabilityRecord>(
			[JUPITER_AVAILABILITY_CONFIG_KEY],
			(prev) => (prev ? { ...prev, ...updated } : updated)
		);
		queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
		queryClient.invalidateQueries({ queryKey: ['jupiterAvailability'] });
		showAlert({
			message: t('availability.settings.save-success'),
			severity: 'success',
		});
		onSuccess();
	};

	const saveMutation = useMutation({
		mutationFn: () =>
			updateAvailabilitySettings({
				bufferTimeMinutes: Number(bufferInput),
			}),
		onError: () => {
			showAlert({
				message: t('availability.settings.save-error'),
				severity: 'error',
			});
		},
		onSuccess: handleSuccess,
	});

	const removeMutation = useMutation({
		mutationFn: () =>
			updateAvailabilitySettings({
				bufferTimeMinutes: 0,
			}),
		onError: () => {
			showAlert({
				message: t('availability.settings.save-error'),
				severity: 'error',
			});
		},
		onSuccess: handleSuccess,
	});

	const parsedMinutes = Number(bufferInput);
	const isValid =
		isBufferMinutesValid(bufferInput) &&
		!Number.isNaN(parsedMinutes);

	return {
		bufferInput,
		isValid,
		removeMutation,
		reset: () => setBufferInput(getBufferInputValue(currentBufferMinutes)),
		saveMutation,
		setBufferInput,
	};
};
