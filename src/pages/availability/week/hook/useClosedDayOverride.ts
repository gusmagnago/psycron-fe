import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createAvailabilityDateOverride } from '@psycron/api/user/availability';
import type { AvailabilityDateOverrideMode } from '@psycron/api/user/availability/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	generateSlotStartTimes,
	parseDurationMinutes,
	parseTimeRange,
} from '../AvailabilityWeekPage.utils';

type AvailabilityConfig = {
	sessionDuration?: string | null;
	timeRange?: string | null;
};

type UseClosedDayOverrideProps = {
	availability?: AvailabilityConfig | null;
	therapistId: string;
};

export const useClosedDayOverride = ({
	availability,
	therapistId,
}: UseClosedDayOverrideProps) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [overrideDate, setOverrideDate] = useState<string | null>(null);
	const [mode, setMode] = useState<AvailabilityDateOverrideMode>('FULL_DAY');
	const [startTime, setStartTime] = useState('09:00');
	const [endTime, setEndTime] = useState('17:00');
	const [selectedSpecificSlots, setSelectedSpecificSlots] = useState<string[]>(
		[]
	);

	const baseTimeRange = useMemo(() => {
		if (!availability?.timeRange) return null;

		try {
			return parseTimeRange(availability.timeRange);
		} catch {
			return null;
		}
	}, [availability?.timeRange]);

	const sessionDurationMinutes = useMemo(() => {
		if (!availability?.sessionDuration) return null;

		try {
			return parseDurationMinutes(availability.sessionDuration);
		} catch {
			return null;
		}
	}, [availability?.sessionDuration]);

	useEffect(() => {
		if (!overrideDate || !baseTimeRange) return;

		setMode('FULL_DAY');
		setStartTime(baseTimeRange.startTime);
		setEndTime(baseTimeRange.endTime);
		setSelectedSpecificSlots([]);
	}, [baseTimeRange, overrideDate]);

	const overrideSlotOptions =
		baseTimeRange && sessionDurationMinutes
			? generateSlotStartTimes(
					baseTimeRange.startTime,
					baseTimeRange.endTime,
					sessionDurationMinutes
				)
			: [];

	const partialSlotOptions =
		sessionDurationMinutes && startTime < endTime
			? generateSlotStartTimes(startTime, endTime, sessionDurationMinutes)
			: [];

	const isConfirmDisabled =
		!availability?.timeRange ||
		!availability?.sessionDuration ||
		(mode === 'TIME_RANGE' && partialSlotOptions.length === 0) ||
		(mode === 'SPECIFIC_SLOTS' && selectedSpecificSlots.length === 0);

	const mutation = useMutation({
		mutationFn: async () => {
			if (!overrideDate) {
				throw new Error('Missing override date');
			}

			if (mode === 'FULL_DAY') {
				return createAvailabilityDateOverride({
					date: overrideDate,
					mode: 'FULL_DAY',
					therapistId,
				});
			}

			if (mode === 'TIME_RANGE') {
				return createAvailabilityDateOverride({
					date: overrideDate,
					endTime,
					mode: 'TIME_RANGE',
					startTime,
					therapistId,
				});
			}

			return createAvailabilityDateOverride({
				date: overrideDate,
				mode: 'SPECIFIC_SLOTS',
				slotStartTimes: selectedSpecificSlots,
				therapistId,
			});
		},
		onError: () => {
			showAlert({
				message: t('availability.week.default-blocked-day.error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			showAlert({
				message: t('availability.week.default-blocked-day.success'),
				severity: 'success',
			});
			setOverrideDate(null);
			setSelectedSpecificSlots([]);
		},
	});

	const open = (date: string) => setOverrideDate(date);

	const close = () => {
		setOverrideDate(null);
		setSelectedSpecificSlots([]);
	};

	const toggleSpecificSlot = (slotTime: string) => {
		setSelectedSpecificSlots((current) =>
			current.includes(slotTime)
				? current.filter((item) => item !== slotTime)
				: [...current, slotTime].sort()
		);
	};

	return {
		close,
		confirm: () => mutation.mutate(),
		endTime,
		isConfirmDisabled,
		isPending: mutation.isPending,
		mode,
		open,
		overrideDate,
		overrideSlotOptions,
		partialSlotOptions,
		selectedSpecificSlots,
		setEndTime,
		setMode,
		setStartTime,
		startTime,
		toggleSpecificSlot,
	};
};
