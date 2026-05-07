import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { Archive } from '@psycron/components/icons';
import { Link } from '@psycron/components/link/Link';
import {
	QueueActionsRow,
	QueueDetailCard,
	QueueDetailEyebrow,
	QueueDetailGrid,
	QueueDetailHeader,
	QueueDetailLabel,
	QueueDetailMessage,
	QueueDetailPanel,
	QueueDetailSubtitle,
	QueueDetailTitle,
	QueueDetailTitleRow,
	QueueDetailValue,
	QueueEmptyState,
} from '@psycron/components/queue-panel';

import {
	ContextList,
	NotificationStatusPill,
	NotificationUtilityRow,
} from '../NotificationsPage.styles';
import {
	formatNotificationAppointment,
	formatNotificationDateTime,
	formatNotificationDeliveryDate,
	getAppointmentCalendarPath,
	getChannelLabelKey,
	getMessageTypeLabelKey,
	getNotificationContextLines,
	getPatientName,
	getPatientProfilePath,
	getStatusColor,
	getStatusLabelKey,
	isNotificationResendable,
} from '../NotificationsPage.utils';

import type { NotificationDetailPanelProps } from './NotificationDetailPanel.types';

export const NotificationDetailPanel = ({
	archiveNotification,
	isArchiving,
	isRetrying,
	notification,
	onRetry,
}: NotificationDetailPanelProps) => {
	const { i18n, t } = useTranslation();

	if (!notification) {
		return (
			<QueueDetailPanel>
				<QueueEmptyState message={t('notifications.empty')} />
			</QueueDetailPanel>
		);
	}

	const patientName =
		getPatientName(notification.patient) ||
		t('notifications.detail.unknown-patient');
	const patientPath = getPatientProfilePath(notification);
	const appointmentPath = getAppointmentCalendarPath(notification);
	const contextLines = getNotificationContextLines(
		notification,
		t,
		i18n.language
	);
	const canResend = isNotificationResendable(notification);

	return (
		<QueueDetailPanel>
			<QueueDetailHeader>
				<QueueDetailEyebrow>
					{t(getChannelLabelKey(notification.channel))}
				</QueueDetailEyebrow>
				<QueueDetailTitleRow>
					<QueueDetailTitle>{t('notifications.detail.title')}</QueueDetailTitle>
					<NotificationStatusPill
						statusColor={getStatusColor(notification.status)}
						title={notification.error ?? undefined}
					>
						{t(getStatusLabelKey(notification.status))}
					</NotificationStatusPill>
				</QueueDetailTitleRow>
				<QueueDetailSubtitle>
					{t(getMessageTypeLabelKey(notification.messageType), {
						defaultValue: notification.messageType,
					})}
					{' · '}
					{formatNotificationDateTime(notification.sentAt, i18n.language)}
				</QueueDetailSubtitle>
			</QueueDetailHeader>

			<QueueDetailGrid>
				<QueueDetailCard>
					<QueueDetailLabel>
						{t('notifications.detail.patient')}
					</QueueDetailLabel>
					<QueueDetailValue>
						{patientPath ? (
							<Link to={patientPath}>{patientName}</Link>
						) : (
							patientName
						)}
					</QueueDetailValue>
				</QueueDetailCard>
				<QueueDetailCard>
					<QueueDetailLabel>
						{t('notifications.detail.appointment')}
					</QueueDetailLabel>
					<QueueDetailValue>
						{appointmentPath ? (
							<Link to={appointmentPath}>
								{formatNotificationAppointment(notification, i18n.language)}
							</Link>
						) : (
							formatNotificationAppointment(notification, i18n.language)
						)}
					</QueueDetailValue>
				</QueueDetailCard>
				<QueueDetailCard>
					<QueueDetailLabel>
						{t('notifications.detail.sent-at')}
					</QueueDetailLabel>
					<QueueDetailValue>
						{formatNotificationDateTime(notification.sentAt, i18n.language)}
					</QueueDetailValue>
				</QueueDetailCard>
				<QueueDetailCard>
					<QueueDetailLabel>
						{t('notifications.detail.delivered-at')}
					</QueueDetailLabel>
					<QueueDetailValue>
						{notification.status === 'FAILED'
							? t('notifications.card.failed')
							: formatNotificationDeliveryDate(notification, i18n.language)}
					</QueueDetailValue>
				</QueueDetailCard>
			</QueueDetailGrid>

			<QueueDetailCard>
				<QueueDetailLabel>{t('notifications.detail.context')}</QueueDetailLabel>
				<ContextList>
					{contextLines.map((line) => (
						<QueueDetailValue key={line}>{line}</QueueDetailValue>
					))}
				</ContextList>
			</QueueDetailCard>

			<QueueDetailCard>
				<QueueDetailLabel>{t('notifications.detail.message')}</QueueDetailLabel>
				<QueueDetailMessage>{notification.content}</QueueDetailMessage>
			</QueueDetailCard>

			<QueueActionsRow>
				{canResend ? (
					<Button
						loading={isRetrying}
						onClick={() => onRetry(notification._id)}
						small
						severity={notification.status === 'FAILED' ? 'error' : undefined}
					>
						{t('notifications.resend.action')}
					</Button>
				) : null}
				<NotificationUtilityRow>
					{!notification.isArchived ? (
						<Button
							disabled={isArchiving}
							loading={isArchiving}
							onClick={() => archiveNotification(notification._id)}
							tertiary
							small
						>
							<Archive aria-hidden='true' />
							{t('notifications.archive.action')}
						</Button>
					) : null}
				</NotificationUtilityRow>
			</QueueActionsRow>
		</QueueDetailPanel>
	);
};
