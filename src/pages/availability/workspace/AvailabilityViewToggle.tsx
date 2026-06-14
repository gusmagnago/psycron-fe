import { RangeGroup } from '@psycron/components/range-group/RangeGroup';

import type {
	AvailabilityViewSelection,
	AvailabilityViewToggleProps,
} from './AvailabilityViewToggle.types';

const AVAILABILITY_VIEW_TOGGLE_ID_PREFIX = 'availability-view-toggle';

export const AvailabilityViewToggle = ({
	dayLabel,
	monthLabel,
	onChange,
	value,
	viewModeLabel,
	weekLabel,
}: AvailabilityViewToggleProps) => (
	<RangeGroup<AvailabilityViewSelection>
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
			{
				ariaLabel: monthLabel,
				label: monthLabel,
				value: 'month',
			},
		]}
		value={value}
		/>
);
