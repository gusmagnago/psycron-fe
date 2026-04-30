import { useTranslation } from 'react-i18next';
import type { INotificationRecord } from '@psycron/api/notifications/index.types';
import { Button } from '@psycron/components/button/Button';
import { Link } from '@psycron/components/link/Link';
import { QueueEmptyState } from '@psycron/components/queue-panel';
import { SlidersHorizontal } from 'lucide-react';

import {
	ActionsRow,
	ContextList,
	DetailCard,
	DetailEyebrow,
	DetailGrid,
	DetailHeader,
	DetailLabel,
	DetailPanel,
	DetailSubtitle,
	DetailTitle,
	DetailTitleRow,
	DetailValue,
	MessagePreview,
	NotificationSettingsLink,
	NotificationStatusPill,
} from '../NotificationsPage.styles';
import {
	formatNotificationAppointment,
	formatNotificationDateTime,
	formatNotificationDeliveryDate,
	getAppointmentCalendarPath,
	getChannelLabelKey,
	getMessageTypeLabelKey,
	getNotificationContextLines,
	getNotificationSettingsPath,
	getPatientName,
	getPatientProfilePath,
	getStatusColor,
	getStatusLabelKey,
	isNotificationResendable,
} from '../NotificationsPage.utils';

interface NotificationDetailPanelProps {
	isRetrying: boolean;
	notification: INotificationRecord | null;
	onRetry: (notificationId: string) => void;
}

export const NotificationDetailPanel = ({
	isRetrying,
	notification,
	onRetry,
}: NotificationDetailPanelProps) => {
	const { i18n, t } = useTranslation();

	if (!notification) {
		return (
			<DetailPanel>
				<QueueEmptyState message={t('notifications.empty')} />
			</DetailPanel>
		);
	}

	const patientName =
		getPatientName(notification.patient) ||
		t('notifications.detail.unknown-patient');
	const patientPath = getPatientProfilePath(notification);
	const appointmentPath = getAppointmentCalendarPath(notification);
	const contextLines = getNotificationContextLines(notification, t, i18n.language);
	const canResend = isNotificationResendable(notification);

	return (
		<DetailPanel>
			<DetailHeader>
				<DetailEyebrow>{t(getChannelLabelKey(notification.channel))}</DetailEyebrow>
				<DetailTitleRow>
					<DetailTitle>{t('notifications.detail.title')}</DetailTitle>
					<NotificationStatusPill
						statusColor={getStatusColor(notification.status)}
						title={notification.error ?? undefined}
					>
						{t(getStatusLabelKey(notification.status))}
					</NotificationStatusPill>
				</DetailTitleRow>
				<DetailSubtitle>
					{t(getMessageTypeLabelKey(notification.messageType), {
						defaultValue: notification.messageType,
					})}
					{' · '}
					{formatNotificationDateTime(notification.sentAt, i18n.language)}
				</DetailSubtitle>
			</DetailHeader>

			<DetailGrid>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.patient')}</DetailLabel>
					<DetailValue>
						{patientPath ? <Link to={patientPath}>{patientName}</Link> : patientName}
					</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.appointment')}</DetailLabel>
					<DetailValue>
						{appointmentPath ? (
							<Link to={appointmentPath}>
								{formatNotificationAppointment(notification, i18n.language)}
							</Link>
						) : (
							formatNotificationAppointment(notification, i18n.language)
						)}
					</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.sent-at')}</DetailLabel>
					<DetailValue>
						{formatNotificationDateTime(notification.sentAt, i18n.language)}
					</DetailValue>
				</DetailCard>
				<DetailCard>
					<DetailLabel>{t('notifications.detail.delivered-at')}</DetailLabel>
					<DetailValue>
						{notification.status === 'FAILED'
							? t('notifications.card.failed')
							: formatNotificationDeliveryDate(notification, i18n.language)}
					</DetailValue>
				</DetailCard>
			</DetailGrid>

			<DetailCard>
				<DetailLabel>{t('notifications.detail.context')}</DetailLabel>
				<ContextList>
					{contextLines.map((line) => (
						<DetailValue key={line}>{line}</DetailValue>
					))}
				</ContextList>
			</DetailCard>

			<DetailCard>
				<DetailLabel>{t('notifications.detail.message')}</DetailLabel>
				<MessagePreview>{notification.content}</MessagePreview>
			</DetailCard>

			<ActionsRow>
				{canResend ? (
					<Button
						loading={isRetrying}
						onClick={() => onRetry(notification._id)}
						severity={notification.status === 'FAILED' ? 'error' : undefined}
					>
						{t('notifications.resend.action')}
					</Button>
				) : null}
				<NotificationSettingsLink
					aria-label={t('notifications.settings.action')}
					title={t('notifications.settings.action')}
					to={getNotificationSettingsPath()}
				>
					<SlidersHorizontal aria-hidden='true' />
					{t('notifications.settings.action')}
				</NotificationSettingsLink>
			</ActionsRow>
		</DetailPanel>
	);
};
