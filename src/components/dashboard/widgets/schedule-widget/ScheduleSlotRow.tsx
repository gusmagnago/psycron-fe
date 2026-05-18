import { useTranslation } from 'react-i18next';
import { StatusChip as DashboardStatusChip } from '@psycron/components/dashboard/status-chip/StatusChip';
import { MapPin } from '@psycron/components/icons';
import { format, parseISO } from 'date-fns';
import { Monitor } from 'lucide-react';

import {
	ProgressBarFill,
	ProgressBarWrapper,
	SlotBody,
	SlotDateLabel,
	SlotMeta,
	SlotPatientName,
	SlotRowRoot,
	SlotTime,
} from './ScheduleSlotRow.styles';
import type { ScheduleSlotRowProps } from './ScheduleSlotRow.types';
import { getSlotStatus, ROW_VARIANTS } from './ScheduleWidget.utils';

export const ScheduleSlotRow = ({ index, onClick, showDate, slot, timezone }: ScheduleSlotRowProps) => {
	const { t } = useTranslation();
	const { progress, status } = getSlotStatus(slot.date, slot.duration, slot.startTime, timezone);

	return (
		<SlotRowRoot
			animate='visible'
			custom={index}
			initial='hidden'
			onClick={() => onClick(slot)}
			status={status}
			variants={ROW_VARIANTS}
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
					{showDate && (
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

			<DashboardStatusChip
				tone={status === 'live' || status === 'done' ? 'success' : 'info'}
			>
				{t(`page.dashboard.widgets.schedule.status.${status}`)}
			</DashboardStatusChip>
		</SlotRowRoot>
	);
};
