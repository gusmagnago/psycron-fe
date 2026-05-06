import {
	QueueFilterChip,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
} from '@psycron/components/queue-panel';

import type { NotificationFilterChipGroupProps } from './NotificationFilterChipGroup.types';

export const NotificationFilterChipGroup = ({
	activeValue,
	allLabel,
	id,
	items,
	label,
	onClear,
	onSelect,
	renderLabel,
}: NotificationFilterChipGroupProps) => (
	<QueueFiltersSection id={id}>
		<QueueFiltersLabel>{label}</QueueFiltersLabel>
		<QueueFiltersRow>
			<QueueFilterChip isActive={!activeValue} onClick={onClear} type='button'>
				{allLabel}
			</QueueFilterChip>
			{items.map((item) => (
				<QueueFilterChip
					isActive={activeValue === item}
					key={item}
					onClick={() => onSelect(item)}
					type='button'
				>
					{renderLabel(item)}
				</QueueFilterChip>
			))}
		</QueueFiltersRow>
	</QueueFiltersSection>
);
