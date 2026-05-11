import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, CalendarRange } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { addMinutes, format, isAfter, isBefore, parseISO } from 'date-fns';
import { MapPin, Monitor } from 'lucide-react';

import {
	CountBadge,
	CountHighlight,
	EmptyState,
	ProgressBarFill,
	ProgressBarWrapper,
	ScheduleRoot,
	ScheduleScrollBox,
	ScheduleSwitcher,
	SkeletonList,
	SlotBody,
	SlotDateLabel,
	SlotMeta,
	SlotPatientName,
	SlotRow,
	SlotSkeleton,
	SlotTime,
	StatusChip,
	SwitcherOption,
	WidgetHeader,
} from './ScheduleWidget.styles';
import type {
	ScheduleWidgetProps,
	SlotStatusChip,
	ViewMode,
} from './ScheduleWidget.types';

const rowVariants = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
	}),
};

const getSlotStatus = (
	startTime: string,
	date: string,
	duration: number
): { progress: number | null; status: SlotStatusChip } => {
	const start = parseISO(`${date}T${startTime}`);
	const end = addMinutes(start, duration);
	const now = new Date();

	if (isAfter(now, start) && isBefore(now, end)) {
		const progress =
			((now.getTime() - start.getTime()) / (duration * 60_000)) * 100;
		return { progress, status: 'live' };
	}
	if (isAfter(now, end)) return { progress: null, status: 'done' };
	return { progress: null, status: 'confirmed' };
};

export const ScheduleWidget = ({
	isLoading,
	slots,
	weekEnd,
	weekHref,
	weekSlotsByDay,
	weekStart,
}: ScheduleWidgetProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const todayStr = format(new Date(), 'yyyy-MM-dd');

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
	const sessionCount =
		viewMode === 'week' ? weekSlots.length : slots.length;
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
					{displaySlots.map((slot, i) => {
						const { status, progress } = getSlotStatus(
							slot.startTime,
							slot.date,
							slot.duration
						);

						return (
							<SlotRow
								animate='visible'
								custom={i}
								initial='hidden'
								isLive={status === 'live'}
								key={`${slot.date}-${slot.startTime}`}
								variants={rowVariants}
							>
								<SlotTime>
									{format(parseISO(`${slot.date}T${slot.startTime}`), 'HH:mm')}
								</SlotTime>
								<SlotBody>
									<SlotPatientName>
										{slot.patientName ??
											t('page.dashboard.widgets.schedule.unknown-patient')}
									</SlotPatientName>
									<SlotMeta>
										{viewMode === 'week' && slot.date !== todayStr && (
											<SlotDateLabel>
												{format(parseISO(slot.date), 'EEE d')}
												{' · '}
											</SlotDateLabel>
										)}
										{slot.deliveryMode === 'online' ? (
											<Monitor size={11} />
										) : (
											<MapPin size={11} />
										)}
										{slot.deliveryMode === 'online'
											? t('page.dashboard.widgets.schedule.online')
											: t('page.dashboard.widgets.schedule.in-person')}
										{' · '}
										{slot.duration} {t('page.dashboard.widgets.schedule.min')}
									</SlotMeta>
									{status === 'live' && progress !== null && (
										<ProgressBarWrapper>
											<ProgressBarFill
												animate={{ width: `${progress}%` }}
												initial={{ width: 0 }}
											/>
										</ProgressBarWrapper>
									)}
								</SlotBody>
								<StatusChip status={status}>
									{t(`page.dashboard.widgets.schedule.status.${status}`)}
								</StatusChip>
							</SlotRow>
						);
					})}
				</ScheduleScrollBox>
			)}
		</ScheduleRoot>
	);
};
