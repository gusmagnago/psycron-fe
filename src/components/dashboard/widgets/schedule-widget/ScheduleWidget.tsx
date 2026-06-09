import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { Calendar } from '@psycron/components/icons';
import { capitalizeDateLabel,getDateLocale } from '@psycron/utils/date/date.utils';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { ScheduleSlotRow } from './ScheduleSlotRow';
import {
	ScheduleEmptyAction,
	ScheduleEmptyBody,
	ScheduleEmptyIcon,
	ScheduleEmptyState,
	ScheduleEmptyTitle,
	ScheduleFooterChip,
	ScheduleFooterChipCount,
	ScheduleFooterChipLabel,
	ScheduleFooterStrip,
	ScheduleHeaderDate,
	ScheduleLoadingList,
	ScheduleRoot,
	ScheduleRowList,
} from './ScheduleWidget.styles';
import type { ScheduleWidgetProps } from './ScheduleWidget.types';
import {
	getBookedDashboardSlots,
	getBookedWeekdayCounts,
} from './ScheduleWidget.utils';

const HEADER_DATE_PATTERN = 'EEE, MMM d';
const SCHEDULE_WIDGET_ID_PREFIX = 'dashboard-schedule-widget';

export const ScheduleWidget = ({
	isLoading,
	onEmptyStateClick,
	onSlotClick,
	onWeekDayClick,
	slots,
	timezone,
	weekSlotsByDay,
	weekStart,
}: ScheduleWidgetProps) => {
	const { t, i18n } = useTranslation();

	const bookedSlots = useMemo(
		() => getBookedDashboardSlots(slots),
		[slots]
	);
	const weekdayItems = useMemo(
		() => getBookedWeekdayCounts(weekStart, weekSlotsByDay),
		[weekSlotsByDay, weekStart]
	);
	const dateLocale = getDateLocale(i18n.language);
	const zonedNow = useMemo(
		() => (timezone ? toZonedTime(new Date(), timezone) : new Date()),
		[timezone]
	);
	const headerDate = useMemo(() => {
		return capitalizeDateLabel(
			format(zonedNow, HEADER_DATE_PATTERN, { locale: dateLocale })
		);
	}, [dateLocale, zonedNow]);

	const body = isLoading ? (
		<ScheduleLoadingList
			data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-loading-list`}
			id={`${SCHEDULE_WIDGET_ID_PREFIX}-loading-list`}
		>
			{Array.from({ length: 5 }, (_, index) => (
				<Skeleton
					height={48}
					data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-loading-${index}`}
					key={index}
					variant='rectangular'
				/>
			))}
		</ScheduleLoadingList>
	) : (
		<ScheduleRoot
			aria-labelledby={`${SCHEDULE_WIDGET_ID_PREFIX}-title`}
			data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-root`}
			id={`${SCHEDULE_WIDGET_ID_PREFIX}-root`}
		>
			{bookedSlots.length > 0 ? (
				<ScheduleRowList
					role='list'
					aria-label={t('page.dashboard.widgets.schedule.rows-aria')}
					data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-rows`}
					id={`${SCHEDULE_WIDGET_ID_PREFIX}-rows`}
				>
					{bookedSlots.map((slot, index) => (
						<ScheduleSlotRow
							index={index}
							key={`${slot.date}-${slot.startTime}-${slot.id}`}
							onClick={onSlotClick}
							slot={slot}
							timezone={timezone}
						/>
					))}
				</ScheduleRowList>
			) : (
				<ScheduleEmptyState
					data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-empty`}
					id={`${SCHEDULE_WIDGET_ID_PREFIX}-empty`}
				>
					<ScheduleEmptyIcon
						aria-hidden='true'
						data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-empty-icon`}
						id={`${SCHEDULE_WIDGET_ID_PREFIX}-empty-icon`}
					>
						<Calendar />
					</ScheduleEmptyIcon>
					<ScheduleEmptyTitle
						data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-empty-title`}
						id={`${SCHEDULE_WIDGET_ID_PREFIX}-empty-title`}
					>
						{t('page.dashboard.widgets.schedule.empty-title')}
					</ScheduleEmptyTitle>
					<ScheduleEmptyBody
						data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-empty-body`}
						id={`${SCHEDULE_WIDGET_ID_PREFIX}-empty-body`}
					>
						{t('page.dashboard.widgets.schedule.empty-body')}
					</ScheduleEmptyBody>
					<ScheduleEmptyAction>
						<Button
							data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-empty-action`}
							id={`${SCHEDULE_WIDGET_ID_PREFIX}-empty-action`}
							onClick={onEmptyStateClick}
							small
							tertiary
							type='button'
						>
							{t('page.dashboard.widgets.schedule.empty-action')}
						</Button>
					</ScheduleEmptyAction>
				</ScheduleEmptyState>
			)}

			<ScheduleFooterStrip
				aria-label={t('page.dashboard.widgets.schedule.week-strip-aria')}
				data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-week-strip`}
				id={`${SCHEDULE_WIDGET_ID_PREFIX}-week-strip`}
				role='list'
			>
				{weekdayItems.map(({ bookedCount, date }) => {
					const day = parseISO(date);
					const isToday = format(day, 'yyyy-MM-dd') === format(
						timezone ? toZonedTime(new Date(), timezone) : new Date(),
						'yyyy-MM-dd'
					);
					const dayLabel = capitalizeDateLabel(
						format(day, 'EEE', { locale: dateLocale })
					);

					return (
						<ScheduleFooterChip
							aria-current={isToday ? 'date' : undefined}
							aria-label={t('page.dashboard.widgets.schedule.weekday-chip-aria', {
								count: bookedCount,
								day: dayLabel,
							})}
							data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-week-chip-${date}`}
							id={`${SCHEDULE_WIDGET_ID_PREFIX}-week-chip-${date}`}
							isToday={isToday}
							key={date}
							onClick={() => onWeekDayClick(date)}
							type='button'
						>
							<ScheduleFooterChipLabel
								id={`${SCHEDULE_WIDGET_ID_PREFIX}-week-chip-${date}-label`}
							>
								{dayLabel}
							</ScheduleFooterChipLabel>
							<ScheduleFooterChipCount
								id={`${SCHEDULE_WIDGET_ID_PREFIX}-week-chip-${date}-count`}
							>
								{bookedCount}
							</ScheduleFooterChipCount>
						</ScheduleFooterChip>
					);
				})}
			</ScheduleFooterStrip>
		</ScheduleRoot>
	);

	return (
		<WidgetLayout
			body={body}
			headerActions={
				<ScheduleHeaderDate
					data-testid={`${SCHEDULE_WIDGET_ID_PREFIX}-header-date`}
					id={`${SCHEDULE_WIDGET_ID_PREFIX}-header-date`}
				>
					{headerDate}
				</ScheduleHeaderDate>
			}
			titleId={`${SCHEDULE_WIDGET_ID_PREFIX}-title`}
			title={t('page.dashboard.widgets.schedule.title-label')}
		/>
	);
};
