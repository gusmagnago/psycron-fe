import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { AvailabilityLegendItem } from '@psycron/components/availability/AvailabilityLegend';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { useCalendarPrefs } from '@psycron/hooks/useCalendarPrefs';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import i18n from '@psycron/i18n';
import {
	AVAILABILITYPATH,
	AVAILABILITYSETTINGS,
	AVAILABILITYWEEK_BASE,
} from '@psycron/pages/urls';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	addWeeks,
	eachDayOfInterval,
	endOfWeek,
	format,
	isAfter,
	isBefore,
	isPast,
	isToday,
	parseISO,
	startOfWeek,
	subWeeks,
} from 'date-fns';

import { BUFFER_COLORS, SLOT_COLORS } from '../AvailabilityWeekPage.styles';
import type {
	IAvailabilityWeekMobileDay,
	IWeekSlot,
} from '../AvailabilityWeekPage.types';
import {
	isBookedMobileSlot,
	isDayFullyBlocked,
	isFreeMobileSlot,
	isFreeOnlyMobileDay,
	LEGEND_STATUSES,
	sortMobileDaySlots,
} from '../AvailabilityWeekPage.utils';

import { useWeekSlots } from './useWeekSlots';

const COLLAPSED_SLOTS_LIMIT = 3;

type UseAvailabilityWeekViewModelProps = {
	date?: string;
};

export const useAvailabilityWeekViewModel = ({
	date,
}: UseAvailabilityWeekViewModelProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { firstDate, lastDate } = useAvailability();
	const {
		activeFilterCount,
		clearFilters,
		prefs,
		toggleDeliveryMode,
		toggleSessionType,
		toggleShowCancelledSlots,
		toggleShowFreeSlots,
		toggleTimeOfDay,
	} = useCalendarPrefs();

	const [expandedDays, setExpandedDays] = useState<Set<string>>(
		() => new Set([format(new Date(), 'yyyy-MM-dd')])
	);

	const { availability } = useJupiterAvailabilityConfig();

	const bufferTimeMinutes = availability?.bufferTimeMinutes ?? 0;
	const baseDate = useMemo(
		() => (date ? parseISO(date) : new Date()),
		[date]
	);
	const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
	const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
	const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

	const { weekData, isLoading } = useWeekSlots(
		weekStart,
		weekEnd,
		bufferTimeMinutes
	);

	const getDaySlots = useCallback(
		(day: Date): IWeekSlot[] => weekData[format(day, 'yyyy-MM-dd')] ?? [],
		[weekData]
	);

	const getVisibleDaySlots = useCallback(
		(day: Date): IWeekSlot[] => {
			let slots = getDaySlots(day);

			if (!prefs.showFreeSlots)
				slots = slots.filter((slot) => !isFreeMobileSlot(slot));
			if (!prefs.showCancelledSlots)
				slots = slots.filter((slot) => slot.status !== 'cancelled');

			if (prefs.sessionTypes.length > 0) {
				slots = slots.filter(
					(slot) =>
						!slot.therapyType || prefs.sessionTypes.includes(slot.therapyType)
				);
			}

			if (prefs.deliveryModes.length > 0) {
				slots = slots.filter(
					(slot) =>
						!slot.deliveryMode ||
						prefs.deliveryModes.includes(slot.deliveryMode)
				);
			}

			if (prefs.timeOfDay.length > 0) {
				slots = slots.filter((slot) => {
					const hour = Number.parseInt(slot.startTime.split(':')[0], 10);
					return prefs.timeOfDay.some((band) => {
						if (band === 'morning') return hour >= 8 && hour < 12;
						if (band === 'afternoon') return hour >= 12 && hour < 17;
						return hour >= 17;
					});
				});
			}

			return slots;
		},
		[prefs, getDaySlots]
	);

	const workingDays = useMemo(
		() => weekDays.filter((day) => format(day, 'yyyy-MM-dd') in weekData),
		[weekDays, weekData]
	);

	const allSessionTypes = useMemo(() => {
		const types = new Set<string>();
		weekDays.forEach((day) => {
			getDaySlots(day).forEach((slot) => {
				if (slot.therapyType) types.add(slot.therapyType);
			});
		});
		return Array.from(types).sort();
	}, [weekDays, getDaySlots]);

	const mobileDays = useMemo<IAvailabilityWeekMobileDay[]>(
		() =>
			workingDays.map((day) => {
				const dateStr = format(day, 'yyyy-MM-dd');
				const allSlots = sortMobileDaySlots(getVisibleDaySlots(day));
				const isExpanded = expandedDays.has(dateStr);
				const bookedSlots = allSlots.filter(isBookedMobileSlot);
				const availableSlots = allSlots.filter(
					(slot) => slot.status === 'available'
				);
				const isFreeOnlyDay = isFreeOnlyMobileDay(allSlots);
				const visibleSlots = isExpanded
					? allSlots
					: bookedSlots.length > 0
						? bookedSlots
						: isFreeOnlyDay
							? availableSlots.length === 1
								? availableSlots
								: []
							: allSlots.slice(0, COLLAPSED_SLOTS_LIMIT);

				return {
					allSlots,
					availableSlotCount: availableSlots.length,
					date: day,
					dateStr,
					fullyBlocked: isDayFullyBlocked(getDaySlots(day)),
					hiddenCount: Math.max(allSlots.length - visibleSlots.length, 0),
					isExpanded,
					isFreeOnlyDay,
					isPastDay: isPast(day) && !isToday(day),
					isToday: isToday(day),
					visibleSlots,
				};
			}),
		[expandedDays, getDaySlots, getVisibleDaySlots, workingDays]
	);

	const legendItems = useMemo<AvailabilityLegendItem[]>(
		() =>
			LEGEND_STATUSES.map(({ status, labelKey }) => ({
				color:
					status === 'buffer'
						? hexToRgba(BUFFER_COLORS.booked, 0.12)
						: SLOT_COLORS[status],
				label: t(labelKey),
				...(status === 'available' && { borderColor: palette.gray['02'] }),
				...(status === 'blocked' && { borderColor: palette.gray['02'] }),
				...(status === 'buffer' && {
					borderColor: BUFFER_COLORS.booked,
					opacity: 1,
				}),
				...(status === 'cancelled' && {
					borderColor: palette.warning.main,
					opacity: 0.78,
				}),
			})),
		[t]
	);

	const weekRange = `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;

	const firstISO = firstDate?.date ? parseISO(firstDate.date) : null;
	const lastISO = lastDate?.date ? parseISO(lastDate.date) : null;

	const canGoPrev = firstISO
		? isAfter(weekStart, startOfWeek(firstISO, { weekStartsOn: 1 }))
		: false;
	const canGoNext = lastISO
		? isBefore(weekStart, startOfWeek(lastISO, { weekStartsOn: 1 }))
		: false;

	const goToPrevWeek = useCallback(
		() =>
			navigate(
				`/${i18n.language}/${AVAILABILITYWEEK_BASE}/${format(subWeeks(baseDate, 1), 'yyyy-MM-dd')}`
			),
		[baseDate, navigate]
	);

	const goToNextWeek = useCallback(
		() =>
			navigate(
				`/${i18n.language}/${AVAILABILITYWEEK_BASE}/${format(addWeeks(baseDate, 1), 'yyyy-MM-dd')}`
			),
		[baseDate, navigate]
	);

	const goToMonth = useCallback(
		() => navigate(`/${i18n.language}/${AVAILABILITYPATH}`),
		[navigate]
	);

	const goToSettings = useCallback(
		() => navigate(`/${i18n.language}/${AVAILABILITYSETTINGS}`),
		[navigate]
	);

	const goToTodayWeek = useCallback(
		() =>
			navigate(
				`/${i18n.language}/${AVAILABILITYWEEK_BASE}/${format(new Date(), 'yyyy-MM-dd')}`
			),
		[navigate]
	);

	const toggleDayExpanded = useCallback((dateStr: string) => {
		setExpandedDays((prev) => {
			const next = new Set(prev);
			if (next.has(dateStr)) next.delete(dateStr);
			else next.add(dateStr);
			return next;
		});
	}, []);

	return {
		activeFilterCount,
		allSessionTypes,
		canGoNext,
		canGoPrev,
		clearFilters,
		getDaySlots,
		getVisibleDaySlots,
		goToMonth,
		goToNextWeek,
		goToPrevWeek,
		goToSettings,
		goToTodayWeek,
		isLoading,
		legendItems,
		mobileDays,
		prefs,
		toggleDayExpanded,
		toggleDeliveryMode,
		toggleSessionType,
		toggleShowCancelledSlots,
		toggleShowFreeSlots,
		toggleTimeOfDay,
		weekData,
		weekDays,
		weekRange,
	};
};
