import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusChip as DashboardStatusChip } from '@psycron/components/dashboard/status-chip/StatusChip';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import {
	SlotBody,
	SlotMeta,
	SlotPatientName,
	SlotRowRoot,
	SlotTime,
} from './ScheduleSlotRow.styles';
import type { ScheduleSlotRowProps } from './ScheduleSlotRow.types';
import { getScheduleSlotStatus,ROW_VARIANTS } from './ScheduleWidget.utils';

export const ScheduleSlotRow = ({
	index,
	onClick,
	slot,
	timezone,
}: ScheduleSlotRowProps) => {
	const { t } = useTranslation();
	const status = getScheduleSlotStatus(slot);
	const startDateTime = useMemo(
		() => parseISO(`${slot.date}T${slot.startTime}`),
		[slot.date, slot.startTime]
	);
	const displayDate = timezone
		? toZonedTime(startDateTime, timezone)
		: startDateTime;
	const rowId = `dashboard-schedule-widget-slot-${slot.id}`;

	return (
		<SlotRowRoot
			aria-label={t('page.dashboard.widgets.schedule.slot-aria', {
				time: format(displayDate, 'HH:mm'),
				name:
					slot.patientName ??
					t('page.dashboard.widgets.schedule.unknown-patient'),
				mode:
					slot.deliveryMode === 'online'
						? t('page.dashboard.widgets.schedule.online')
						: t('page.dashboard.widgets.schedule.in-person'),
			})}
			animate='visible'
			custom={index}
			initial='hidden'
			id={rowId}
			onClick={() => onClick(slot)}
			data-testid={rowId}
			status={status}
			type='button'
			variants={ROW_VARIANTS}
		>
			<SlotTime id={`${rowId}-time`}>
				{format(displayDate, 'HH:mm')}
			</SlotTime>

			<SlotBody id={`${rowId}-body`}>
				<SlotPatientName id={`${rowId}-patient`}>
					{slot.patientName ??
						t('page.dashboard.widgets.schedule.unknown-patient')}
				</SlotPatientName>

				<SlotMeta id={`${rowId}-meta`}>
					{slot.deliveryMode === 'online'
						? t('page.dashboard.widgets.schedule.online')
						: t('page.dashboard.widgets.schedule.in-person')}
					{' · '}
					{slot.duration} {t('page.dashboard.widgets.schedule.min')}
				</SlotMeta>
			</SlotBody>

			<DashboardStatusChip
				id={`${rowId}-status`}
				data-testid={`${rowId}-status`}
				tone={status === 'cancelled' ? 'danger' : 'brand'}
			>
				{t(`page.dashboard.widgets.schedule.status.${status}`)}
			</DashboardStatusChip>
		</SlotRowRoot>
	);
};
