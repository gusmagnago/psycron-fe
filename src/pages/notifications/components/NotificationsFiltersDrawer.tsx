import { useTranslation } from 'react-i18next';
import type { SelectChangeEvent } from '@mui/material';
import {
	QueueFilterChip,
	QueueFiltersDrawer,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
	QueueSearchField,
} from '@psycron/components/queue-panel';
import { Select } from '@psycron/components/select/Select';

import {
	FiltersContent,
	SortControlWrapper,
} from '../NotificationsPage.styles';
import type { NotificationSortOption } from '../NotificationsPage.types';
import {
	NOTIFICATION_CHANNELS,
	NOTIFICATION_MESSAGE_TYPES,
	NOTIFICATION_STATUSES,
} from '../NotificationsPage.utils';

import { NotificationFilterChipGroup } from './NotificationFilterChipGroup';
import type { NotificationsFiltersDrawerProps } from './NotificationsFiltersDrawer.types';

export const NotificationsFiltersDrawer = ({
	activeFilterCount,
	filters,
	isOpen,
	onClose,
	onUpdateFilter,
	onUpdateSort,
	sortOption,
}: NotificationsFiltersDrawerProps) => {
	const { t } = useTranslation();

	const updateSortOption = (event: SelectChangeEvent): void => {
		onUpdateSort(event.target.value as NotificationSortOption);
	};

	const sortingItems = [
		{ name: t('notifications.sort.options.newest'), value: 'newest' },
		{ name: t('notifications.sort.options.oldest'), value: 'oldest' },
		{ name: t('notifications.sort.options.status'), value: 'status' },
	];

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
				<QueueFiltersSection>
					<QueueFiltersLabel>
						{t('notifications.filters.archived')}
					</QueueFiltersLabel>
					<QueueFiltersRow>
						<QueueFilterChip
							isActive={!filters.archived}
							onClick={() => onUpdateFilter('archived', undefined)}
							type='button'
						>
							{t('notifications.filters.active')}
						</QueueFilterChip>
						<QueueFilterChip
							isActive={Boolean(filters.archived)}
							onClick={() => onUpdateFilter('archived', true)}
							type='button'
						>
							{t('notifications.filters.archived')}
						</QueueFilterChip>
					</QueueFiltersRow>
				</QueueFiltersSection>

				<QueueFiltersSection>
					<QueueFiltersLabel>{t('notifications.sort.label')}</QueueFiltersLabel>
					<SortControlWrapper>
						<Select
							hiddenLabel
							items={sortingItems}
							name='notifications-sort'
							onChangeSelect={updateSortOption}
							selectLabel={t('notifications.sort.label')}
							value={sortOption}
						/>
					</SortControlWrapper>
				</QueueFiltersSection>

				<NotificationFilterChipGroup
					activeValue={filters.channel}
					allLabel={t('notifications.filters.all-channels')}
					id='notifications-filters-drawer'
					items={NOTIFICATION_CHANNELS}
					label={t('notifications.filters.channel')}
					onClear={() => onUpdateFilter('channel', undefined)}
					onSelect={(value) =>
						onUpdateFilter('channel', value as typeof filters.channel)
					}
					renderLabel={(value) =>
						t(`notifications.channels.${value.toLowerCase()}`)
					}
				/>

				<NotificationFilterChipGroup
					activeValue={filters.status}
					allLabel={t('notifications.filters.all-statuses')}
					items={NOTIFICATION_STATUSES}
					label={t('notifications.filters.status')}
					onClear={() => onUpdateFilter('status', undefined)}
					onSelect={(value) =>
						onUpdateFilter('status', value as typeof filters.status)
					}
					renderLabel={(value) =>
						t(`notifications.statuses.${value.toLowerCase()}`)
					}
				/>

				<NotificationFilterChipGroup
					activeValue={filters.messageType}
					allLabel={t('notifications.filters.all-types')}
					items={NOTIFICATION_MESSAGE_TYPES}
					label={t('notifications.filters.message-type')}
					onClear={() => onUpdateFilter('messageType', undefined)}
					onSelect={(value) => onUpdateFilter('messageType', value)}
					renderLabel={(value) =>
						t(`notifications.message-types.${value.toLowerCase()}`)
					}
				/>

				<QueueFiltersSection>
					<QueueFiltersLabel>
						{t('notifications.filters.date-range')}
					</QueueFiltersLabel>
					<QueueSearchField
						slotProps={{ inputLabel: { shrink: true } }}
						label={t('notifications.filters.from')}
						onChange={(event) => onUpdateFilter('from', event.target.value)}
						size='small'
						type='date'
						value={filters.from ?? ''}
					/>
					<QueueSearchField
						slotProps={{ inputLabel: { shrink: true } }}
						label={t('notifications.filters.to')}
						onChange={(event) => onUpdateFilter('to', event.target.value)}
						size='small'
						type='date'
						value={filters.to ?? ''}
					/>
				</QueueFiltersSection>
			</FiltersContent>
		</QueueFiltersDrawer>
	);
};
