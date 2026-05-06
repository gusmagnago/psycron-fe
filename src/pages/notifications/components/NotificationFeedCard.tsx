import type { KeyboardEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { INotificationRecord } from '@psycron/api/notifications/index.types';
import { Button } from '@psycron/components/button/Button';
import {
	QueueSelectableCard,
	QueueSelectableCardMetaRow,
} from '@psycron/components/queue-panel';

import {
	NotificationCardActions,
	NotificationCardDate,
	NotificationCardInfo,
	NotificationChannelLabel,
	NotificationPreview,
	NotificationStatusPill,
	NotificationTitle,
} from '../NotificationsPage.styles';
import {
	formatNotificationAppointment,
	formatNotificationDateTime,
	formatNotificationDeliveryDate,
	getChannelLabelKey,
	getMessageTypeLabelKey,
	getNotificationCardTone,
	getNotificationPreview,
	getPatientName,
	getStatusColor,
	getStatusLabelKey,
	isNotificationResendable,
} from '../NotificationsPage.utils';

interface NotificationFeedCardProps {
	isRetrying: boolean;
	isSelected: boolean;
	notification: INotificationRecord;
	onRetry: (notificationId: string) => void;
	onSelect: (notificationId: string) => void;
}

export const NotificationFeedCard = ({
	isRetrying,
	isSelected,
	notification,
	onRetry,
	onSelect,
}: NotificationFeedCardProps) => {
	const { i18n, t } = useTranslation();
	const patientName = getPatientName(notification.patient);
	const canResend = isNotificationResendable(notification);

	const handleRetry = (event: MouseEvent<HTMLButtonElement>): void => {
		event.stopPropagation();
		onRetry(notification._id);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
		if (event.key !== 'Enter' && event.key !== ' ') return;

		event.preventDefault();
		onSelect(notification._id);
	};

	return (
		<QueueSelectableCard
			isSelected={isSelected}
			onKeyDown={handleKeyDown}
			onClick={() => onSelect(notification._id)}
			tabIndex={0}
			tone={getNotificationCardTone(notification.status)}
		>
			<QueueSelectableCardMetaRow>
				<NotificationChannelLabel>
					{t(getChannelLabelKey(notification.channel))}
				</NotificationChannelLabel>
				<NotificationStatusPill
					statusColor={getStatusColor(notification.status)}
					title={notification.error ?? undefined}
				>
					{t(getStatusLabelKey(notification.status))}
				</NotificationStatusPill>
			</QueueSelectableCardMetaRow>
			<NotificationTitle>
				{patientName || t('notifications.detail.unknown-patient')}
			</NotificationTitle>
			<NotificationPreview>
				{t(getMessageTypeLabelKey(notification.messageType), {
					defaultValue: notification.messageType,
				})}
				{' · '}
				{getNotificationPreview(notification)}
			</NotificationPreview>
			{notification.appointment?.date || notification.appointmentId ? (
				<NotificationCardInfo>
					{t('notifications.card.appointment', {
						value: formatNotificationAppointment(notification, i18n.language),
					})}
				</NotificationCardInfo>
			) : null}
			<NotificationCardInfo>
				{notification.status === 'FAILED'
					? t('notifications.card.failed')
					: t('notifications.card.delivered-at', {
							value: formatNotificationDeliveryDate(notification, i18n.language),
						})}
			</NotificationCardInfo>
			<NotificationCardActions>
				<NotificationCardDate>
					{formatNotificationDateTime(notification.sentAt, i18n.language)}
				</NotificationCardDate>
				{canResend ? (
					<Button
						loading={isRetrying}
						onClick={handleRetry}
						severity={notification.status === 'FAILED' ? 'error' : undefined}
						small
					>
						{t('notifications.resend.action-short')}
					</Button>
				) : null}
			</NotificationCardActions>
		</QueueSelectableCard>
	);
};
