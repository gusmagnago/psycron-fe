import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { addMinutes, format, isAfter, isBefore, parseISO } from 'date-fns';
import { ArrowRight, MapPin,Monitor } from 'lucide-react';

import {
	CountBadge,
	CountHighlight,
	ProgressBarFill,
	ProgressBarWrapper,
	ScheduleScrollBox,
	SlotBody,
	SlotMeta,
	SlotPatientName,
	SlotRow,
	SlotTime,
	StatusChip,
	ViewWeekLink,
	WidgetHeader,
	WidgetTitle,
} from './ScheduleWidget.styles';
import type { ScheduleWidgetProps } from './ScheduleWidget.types';

const rowVariants = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
	}),
};

type SlotStatusChip = 'confirmed' | 'done' | 'live' | 'pending';

const getSlotStatus = (
	startTime: string,
	date: string,
	duration: number
): { progress: number | null; status: SlotStatusChip } => {
	const start = parseISO(`${date}T${startTime}`);
	const end = addMinutes(start, duration);
	const now = new Date();

	if (isAfter(now, start) && isBefore(now, end)) {
		const progress = ((now.getTime() - start.getTime()) / (duration * 60_000)) * 100;
		return { progress, status: 'live' };
	}
	if (isAfter(now, end)) return { progress: null, status: 'done' };
	return { progress: null, status: 'confirmed' };
};

export const ScheduleWidget = ({
	isLoading,
	onViewWeek,
	slots,
}: ScheduleWidgetProps) => {
	const { t } = useTranslation();

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

	if (isLoading) {
		return (
			<Box display='flex' flexDirection='column' gap={1}>
				{[...Array(5)].map((_, i) => (
					<Skeleton
						height={48}
						key={`schedule-skeleton-${i}`}
						sx={{ borderRadius: '10px' }}
						variant='rectangular'
					/>
				))}
			</Box>
		);
	}

	return (
		<Box display='flex' flexDirection='column' height='100%' gap={1}>
			<WidgetHeader>
				<Box>
					<WidgetTitle>{t('page.dashboard.widgets.schedule.title')}</WidgetTitle>
					<CountBadge>
						<CountHighlight>{bookedSlots.length}</CountHighlight>
						/{slots.length} {t('page.dashboard.widgets.schedule.sessions-today')}
					</CountBadge>
				</Box>
				{onViewWeek && (
					<ViewWeekLink onClick={onViewWeek} role='button'>
						{t('page.dashboard.widgets.schedule.view-week')}
						<ArrowRight size={13} />
					</ViewWeekLink>
				)}
			</WidgetHeader>

			{bookedSlots.length === 0 ? (
				<Box sx={{ opacity: 0.5, textAlign: 'center', py: 3, fontSize: 14, flex: 1 }}>
					{t('page.dashboard.widgets.schedule.empty')}
				</Box>
			) : (
				<ScheduleScrollBox>
					{bookedSlots.map((slot, i) => {
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
								<SlotTime>{format(parseISO(`${slot.date}T${slot.startTime}`), 'HH:mm')}</SlotTime>
								<SlotBody>
									<SlotPatientName>
										{slot.patientName ?? t('page.dashboard.widgets.schedule.unknown-patient')}
									</SlotPatientName>
									<SlotMeta>
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
									{status === 'live'
										? 'LIVE'
										: t(`page.dashboard.widgets.schedule.status.${status}`)}
								</StatusChip>
							</SlotRow>
						);
					})}
				</ScheduleScrollBox>
			)}
		</Box>
	);
};
