import { RangeGroup } from '@psycron/components/range-group/RangeGroup';

import type {
	AvailabilityViewMode,
	AvailabilityViewToggleProps,
} from './AvailabilityViewToggle.types';

const AVAILABILITY_VIEW_TOGGLE_ID_PREFIX = 'availability-view-toggle';

export const AvailabilityViewToggle = ({
	dayLabel,
	onChange,
	value,
	viewModeLabel,
	weekLabel,
}: AvailabilityViewToggleProps) => (
	<RangeGroup<AvailabilityViewMode>
		ariaLabel={viewModeLabel}
		idPrefix={AVAILABILITY_VIEW_TOGGLE_ID_PREFIX}
		onChange={onChange}
		options={[
			{
				ariaLabel: dayLabel,
				label: dayLabel,
				value: 'day',
			},
			{
				ariaLabel: weekLabel,
				label: weekLabel,
				value: 'week',
			},
		]}
		value={value}
		/>
);
