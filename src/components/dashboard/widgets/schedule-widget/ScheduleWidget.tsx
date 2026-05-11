import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, CalendarRange } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { parseISO } from 'date-fns';

import { ScheduleSlotRow } from './ScheduleSlotRow';
import {
	CountBadge,
	CountHighlight,
	EmptyState,
	ScheduleRoot,
	ScheduleScrollBox,
	ScheduleSwitcher,
	SkeletonList,
	SlotSkeleton,
	SwitcherOption,
	WidgetHeader,
} from './ScheduleWidget.styles';
import type { ScheduleWidgetProps, ViewMode } from './ScheduleWidget.types';

export const ScheduleWidget = ({
	isLoading,
	onSlotClick,
	slots,
	weekEnd,
	weekHref,
	weekSlotsByDay,
	weekStart,
}: ScheduleWidgetProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const todayStr = new Date().toISOString().substring(0, 10);

	const [viewMode, setViewMode] = useState<ViewMode>('today');
	const autoSwitched = useRef(false);

	const bookedSlots = useMemo(
		() =>
			slots
				.filter(
					(s) => s.status === 'booked-jupiter' || s.status === 'booked-google'
				)
				.sort(
					(a, b) =>
						parseISO(`${a.date}T${a.startTime}`).getTime() -
						parseISO(`${b.date}T${b.startTime}`).getTime()
				),
		[slots]
	);

	const weekSlots = useMemo(
		() =>
			weekSlotsByDay
				? Object.entries(weekSlotsByDay)
						.filter(
							([date]) =>
								(!weekStart || date >= weekStart) &&
								(!weekEnd || date <= weekEnd)
						)
						.flatMap(([, daySlots]) =>
							daySlots.filter(
								(s) =>
									s.status === 'booked-jupiter' || s.status === 'booked-google'
							)
						)
						.sort(
							(a, b) =>
								parseISO(`${a.date}T${a.startTime}`).getTime() -
								parseISO(`${b.date}T${b.startTime}`).getTime()
						)
				: [],
		[weekSlotsByDay, weekStart, weekEnd]
	);

	useEffect(() => {
		if (
			!autoSwitched.current &&
			!isLoading &&
			bookedSlots.length === 0 &&
			weekSlots.length > 0
		) {
			autoSwitched.current = true;
			setViewMode('week');
		}
	}, [isLoading, bookedSlots.length, weekSlots.length]);

	const displaySlots = viewMode === 'week' ? weekSlots : bookedSlots;
	const sessionCount = viewMode === 'week' ? weekSlots.length : slots.length;
	const sessionLabel =
		viewMode === 'week'
			? t('page.dashboard.widgets.schedule.sessions-week')
			: t('page.dashboard.widgets.schedule.sessions-today');

	if (isLoading) {
		return (
			<SkeletonList>
				{Array.from({ length: 5 }, (_, i) => (
					<SlotSkeleton height={48} key={i} variant='rectangular' />
				))}
			</SkeletonList>
		);
	}

	return (
		<ScheduleRoot>
			<WidgetHeader>
				<ScheduleSwitcher>
					<SwitcherOption
						aria-label={t('page.dashboard.widgets.schedule.title')}
						isActive={viewMode === 'today'}
						onClick={() => setViewMode('today')}
					>
						<Calendar />
						{t('page.dashboard.widgets.schedule.title')}
					</SwitcherOption>
					<SwitcherOption
						aria-label={t('page.dashboard.widgets.schedule.title-week')}
						isActive={viewMode === 'week'}
						onClick={() => setViewMode('week')}
					>
						<CalendarRange />
						{t('page.dashboard.widgets.schedule.title-week')}
					</SwitcherOption>
				</ScheduleSwitcher>

				{weekHref && (
					<Tooltip
						aria-label={t('page.dashboard.widgets.schedule.view-week')}
						onClick={() => navigate(`../${weekHref}`)}
						placement='bottom'
						title={t('page.dashboard.widgets.schedule.view-week')}
					>
						<Calendar />
					</Tooltip>
				)}
			</WidgetHeader>

			<CountBadge>
				<CountHighlight>{displaySlots.length}</CountHighlight>
				{' / '}
				{sessionCount} {sessionLabel}
			</CountBadge>

			{displaySlots.length === 0 ? (
				<EmptyState>{t('page.dashboard.widgets.schedule.empty')}</EmptyState>
			) : (
				<ScheduleScrollBox>
					{displaySlots.map((slot, i) => (
						<ScheduleSlotRow
							index={i}
							key={`${slot.date}-${slot.startTime}`}
							onClick={onSlotClick}
							showDate={viewMode === 'week' && slot.date !== todayStr}
							slot={slot}
						/>
					))}
				</ScheduleScrollBox>
			)}
		</ScheduleRoot>
	);
};
