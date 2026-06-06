import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RangeToggle } from '@psycron/components/dashboard/range-toggle/RangeToggle';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
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
	SkeletonList,
	SlotSkeleton,
} from './ScheduleWidget.styles';
import type { ScheduleWidgetProps, ViewMode } from './ScheduleWidget.types';

export const ScheduleWidget = ({
	isLoading,
	onSlotClick,
	slots,
	timezone,
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

	const title = useMemo(
		() =>
			viewMode === 'week'
				? t('page.dashboard.widgets.schedule.title-week-label')
				: t('page.dashboard.widgets.schedule.title-label'),
		[t, viewMode]
	);

	const headerActions = useMemo(
		() => (
			<>
				<RangeToggle<ViewMode>
					ariaLabel={t('page.dashboard.widgets.schedule.range-aria-label')}
					onChange={setViewMode}
					options={[
						{
							ariaLabel: t('page.dashboard.widgets.schedule.title'),
							icon: <Calendar />,
							label: t('page.dashboard.widgets.schedule.title'),
							value: 'today',
						},
						{
							ariaLabel: t('page.dashboard.widgets.schedule.title-week'),
							icon: <CalendarRange />,
							label: t('page.dashboard.widgets.schedule.title-week'),
							value: 'week',
						},
					]}
					value={viewMode}
				/>
				{weekHref && (
					<Tooltip
						aria-label={t('page.dashboard.widgets.schedule.view-week')}
						onClick={() => navigate(`../${weekHref}`)}
						placement='bottom'
						title={t('page.dashboard.widgets.schedule.view-week')}
					>
						<CalendarRange />
					</Tooltip>
				)}
			</>
		),
		[navigate, t, viewMode, weekHref]
	);

	const body = isLoading ? (
		<SkeletonList>
			{Array.from({ length: 5 }, (_, i) => (
				<SlotSkeleton height={48} key={i} variant='rectangular' />
			))}
		</SkeletonList>
	) : (
		<ScheduleRoot>
			<CountBadge>
				<CountHighlight>{displaySlots.length}</CountHighlight>
				{viewMode === 'today' && <>{' / '}{sessionCount}</>}
				{' '}{sessionLabel}
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
							timezone={timezone}
						/>
					))}
				</ScheduleScrollBox>
			)}
		</ScheduleRoot>
	);

	return (
		<WidgetLayout
			body={body}
			headerActions={headerActions}
			title={title}
		/>
	);
};
