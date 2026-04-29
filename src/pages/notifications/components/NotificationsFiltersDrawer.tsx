import { useTranslation } from 'react-i18next';
import type {
	NotificationChannel,
	NotificationStatus,
} from '@psycron/api/notifications/index.types';
import { QueueFiltersDrawer } from '@psycron/components/queue-panel';

import {
	FilterChip,
	FiltersContent,
	FiltersLabel,
	FiltersRow,
	FiltersSection,
	SearchField,
} from '../NotificationsPage.styles';
import type { NotificationFilters } from '../NotificationsPage.types';

interface NotificationsFiltersDrawerProps {
	activeFilterCount: number;
	filters: NotificationFilters;
	isOpen: boolean;
	onClose: () => void;
	onUpdateFilter: <Key extends keyof NotificationFilters>(
		key: Key,
		value: NotificationFilters[Key]
	) => void;
}

const CHANNELS: NotificationChannel[] = ['WHATSAPP', 'EMAIL', 'SMS'];
const STATUSES: NotificationStatus[] = [
	'FAILED',
	'PENDING',
	'SENT',
	'DELIVERED',
];
const MESSAGE_TYPES = [
	'APPOINTMENT_CONFIRMATION',
	'REMINDER',
	'CANCELLATION',
	'RESCHEDULE',
] as const;

export const NotificationsFiltersDrawer = ({
	activeFilterCount,
	filters,
	isOpen,
	onClose,
	onUpdateFilter,
}: NotificationsFiltersDrawerProps) => {
	const { t } = useTranslation();

	return (
		<QueueFiltersDrawer
			activeFilterCount={activeFilterCount}
			ariaLabel={t('notifications.filters.title')}
			isOpen={isOpen}
			onClose={onClose}
			summaryActive={t('notifications.filters.summary-active', {
				count: activeFilterCount,
			})}
			summaryDefault={t('notifications.filters.summary-default')}
			title={t('notifications.filters.title')}
		>
			<FiltersContent>
				<FiltersSection id='notifications-filters-drawer'>
					<FiltersLabel>{t('notifications.filters.channel')}</FiltersLabel>
					<FiltersRow>
						<FilterChip
							isActive={!filters.channel}
							onClick={() => onUpdateFilter('channel', undefined)}
							type='button'
						>
							{t('notifications.filters.all-channels')}
						</FilterChip>
						{CHANNELS.map((channel) => (
							<FilterChip
								isActive={filters.channel === channel}
								key={channel}
								onClick={() => onUpdateFilter('channel', channel)}
								type='button'
							>
								{t(`notifications.channels.${channel.toLowerCase()}`)}
							</FilterChip>
						))}
					</FiltersRow>
				</FiltersSection>

				<FiltersSection>
					<FiltersLabel>{t('notifications.filters.status')}</FiltersLabel>
					<FiltersRow>
						<FilterChip
							isActive={!filters.status}
							onClick={() => onUpdateFilter('status', undefined)}
							type='button'
						>
							{t('notifications.filters.all-statuses')}
						</FilterChip>
						{STATUSES.map((status) => (
							<FilterChip
								isActive={filters.status === status}
								key={status}
								onClick={() => onUpdateFilter('status', status)}
								type='button'
							>
								{t(`notifications.statuses.${status.toLowerCase()}`)}
							</FilterChip>
						))}
					</FiltersRow>
				</FiltersSection>

				<FiltersSection>
					<FiltersLabel>{t('notifications.filters.message-type')}</FiltersLabel>
					<FiltersRow>
						<FilterChip
							isActive={!filters.messageType}
							onClick={() => onUpdateFilter('messageType', undefined)}
							type='button'
						>
							{t('notifications.filters.all-types')}
						</FilterChip>
						{MESSAGE_TYPES.map((messageType) => (
							<FilterChip
								isActive={filters.messageType === messageType}
								key={messageType}
								onClick={() => onUpdateFilter('messageType', messageType)}
								type='button'
							>
								{t(`notifications.message-types.${messageType.toLowerCase()}`)}
							</FilterChip>
						))}
					</FiltersRow>
				</FiltersSection>

				<FiltersSection>
					<FiltersLabel>{t('notifications.filters.date-range')}</FiltersLabel>
					<SearchField
						InputLabelProps={{ shrink: true }}
						label={t('notifications.filters.from')}
						onChange={(event) => onUpdateFilter('from', event.target.value)}
						size='small'
						type='date'
						value={filters.from ?? ''}
					/>
					<SearchField
						InputLabelProps={{ shrink: true }}
						label={t('notifications.filters.to')}
						onChange={(event) => onUpdateFilter('to', event.target.value)}
						size='small'
						type='date'
						value={filters.to ?? ''}
					/>
				</FiltersSection>
			</FiltersContent>
		</QueueFiltersDrawer>
	);
};
