import type { ReactElement } from 'react';

import {
	RangeGroupButton,
	RangeGroupRoot,
} from './RangeGroup.styles';
import type { RangeGroupProps } from './RangeGroup.types';

export const RangeGroup = <Value extends string,>({
	ariaLabel,
	disabled = false,
	idPrefix,
	onChange,
	options,
	size = 'medium',
	value,
}: RangeGroupProps<Value>): ReactElement => (
	<RangeGroupRoot
		aria-label={ariaLabel}
		aria-disabled={disabled}
		groupSize={size}
		id={`${idPrefix}-group`}
		role='group'
	>
		{options.map((option) => {
			const isActive = option.value === value;

			return (
				<RangeGroupButton
					aria-label={option.ariaLabel ?? option.label}
					aria-pressed={isActive}
					groupSize={size}
					id={`${idPrefix}-${option.value}`}
					isActive={isActive}
					disabled={disabled}
					key={option.value}
					onClick={disabled ? undefined : () => onChange(option.value)}
					small={size === 'small'}
					tertiary
					type='button'
					variant={isActive ? 'contained' : 'text'}
				>
					{option.label}
				</RangeGroupButton>
			);
		})}
	</RangeGroupRoot>
);
