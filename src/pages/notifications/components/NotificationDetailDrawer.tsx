import { useTranslation } from 'react-i18next';
import type { INotificationRecord } from '@psycron/api/notifications/index.types';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { format } from 'date-fns';

import {
	DetailCard,
	DetailGrid,
	DetailLabel,
	DetailValue,
	MessagePreview,
	PayloadPreview,
} from '../NotificationsPage.styles';
import {
	getChannelLabelKey,
	getMessageTypeLabelKey,
	getPatientName,
	getStatusLabelKey,
} from '../NotificationsPage.utils';

interface NotificationDetailDrawerProps {
	isRetrying: boolean;
	notification: INotificationRecord;
	onClose: () => void;
	onRetry: (notificationId: string) => void;
}

const formatDateTime = (value?: string | null): string => {
	if (!value) return '-';

	return format(new Date(value), 'PPp');
};

export const NotificationDetailDrawer = ({
	isRetrying,
	notification,
	onClose,
	onRetry,
}: NotificationDetailDrawerProps) => {
	const { t } = useTranslation();
	const patientName = getPatientName(notification.patient);
	const payload =
		notification.payload == null
			? null
			: JSON.stringify(notification.payload, null, 2);

	return (
		<Drawer
			ariaLabel={t('notifications.drawer.aria-label')}
			onClose={onClose}
			title={t('notifications.drawer.title')}
			actions={
				notification.status === 'FAILED' ? (
					<Button
						loading={isRetrying}
						onClick={() => onRetry(notification._id)}
						severity='warning'
					>
						{t('notifications.retry.action')}
					</Button>
				) : null
			}
		>
			<DetailGrid>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.patient')}</DetailLabel>
					<DetailValue>
						{patientName || t('notifications.detail.unknown-patient')}
					</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.message-type')}</DetailLabel>
					<DetailValue>
						{t(getMessageTypeLabelKey(notification.messageType), {
							defaultValue: notification.messageType,
						})}
					</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.channel')}</DetailLabel>
					<DetailValue>{t(getChannelLabelKey(notification.channel))}</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.status')}</DetailLabel>
					<DetailValue>{t(getStatusLabelKey(notification.status))}</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.sent-at')}</DetailLabel>
					<DetailValue>{formatDateTime(notification.sentAt)}</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.delivered-at')}</DetailLabel>
					<DetailValue>{formatDateTime(notification.deliveredAt)}</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.appointment')}</DetailLabel>
					<DetailValue>
						{notification.appointment?.date
							? formatDateTime(notification.appointment.date)
							: notification.appointmentId || '-'}
					</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.ics')}</DetailLabel>
					<DetailValue>
						{notification.icsContent
							? t('notifications.detail.ics-attached')
							: t('notifications.detail.ics-empty')}
					</DetailValue>
				</DetailCard>
			</DetailGrid>

			<DetailCard>
				<DetailLabel>{t('notifications.detail.message')}</DetailLabel>
				<MessagePreview>{notification.content}</MessagePreview>
			</DetailCard>

			{notification.error ? (
				<DetailCard>
					<DetailLabel>{t('notifications.detail.error')}</DetailLabel>
					<MessagePreview>{notification.error}</MessagePreview>
				</DetailCard>
			) : null}

			{payload ? (
				<DetailCard>
					<DetailLabel>{t('notifications.detail.payload')}</DetailLabel>
					<PayloadPreview>{payload}</PayloadPreview>
				</DetailCard>
			) : null}
		</Drawer>
	);
};
