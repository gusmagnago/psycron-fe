import { useTranslation } from 'react-i18next';
import type { SelectChangeEvent } from '@mui/material';
import type {
	NotificationChannel,
	NotificationMessageType,
	NotificationStatus,
} from '@psycron/api/notifications/index.types';
import { QueueFiltersDrawer } from '@psycron/components/queue-panel';
import { Select } from '@psycron/components/select/Select';

import {
	FilterChip,
	FiltersContent,
	FiltersLabel,
	FiltersRow,
	FiltersSection,
	SearchField,
	SortControlWrapper,
} from '../NotificationsPage.styles';
import type {
	NotificationFilters,
	NotificationSortOption,
} from '../NotificationsPage.types';

interface NotificationsFiltersDrawerProps {
	activeFilterCount: number;
	filters: NotificationFilters;
	isOpen: boolean;
	onClose: () => void;
	onUpdateFilter: <Key extends keyof NotificationFilters>(
		key: Key,
		value: NotificationFilters[Key]
	) => void;
	onUpdateSort: (value: NotificationSortOption) => void;
	sortOption: NotificationSortOption;
}

const CHANNELS: NotificationChannel[] = [
	'WHATSAPP',
	'EMAIL',
	'SMS',
	'ICALENDAR',
];
const STATUSES: NotificationStatus[] = [
	'FAILED',
	'PENDING',
	'SENT',
	'DELIVERED',
];
const MESSAGE_TYPES = [
	'APPOINTMENT_CONFIRMATION',
	'APPOINTMENT_UPDATED',
	'REMINDER',
	'CONFLICT',
	'ACCOUNT_SETUP',
	'DAILY_SCHEDULE_SUMMARY',
] satisfies NotificationMessageType[];

export const NotificationsFiltersDrawer = ({
	activeFilterCount,
	filters,
	isOpen,
	onClose,
	onUpdateSort,
	onUpdateFilter,
	sortOption,
}: NotificationsFiltersDrawerProps) => {
	const { t } = useTranslation();
	const updateSortOption = (event: SelectChangeEvent<string | number>): void => {
		onUpdateSort(event.target.value as NotificationSortOption);
	};

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
				<FiltersSection>
					<FiltersLabel>{t('notifications.sort.label')}</FiltersLabel>
					<SortControlWrapper>
						<Select
							items={[
								{
									name: t('notifications.sort.options.newest'),
									value: 'newest',
								},
								{
									name: t('notifications.sort.options.oldest'),
									value: 'oldest',
								},
								{
									name: t('notifications.sort.options.status'),
									value: 'status',
								},
							]}
							name='notifications-sort'
							onChangeSelect={updateSortOption}
							selectLabel={t('notifications.sort.label')}
							value={sortOption}
						/>
					</SortControlWrapper>
				</FiltersSection>

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
