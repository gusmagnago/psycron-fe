import {
	RangeToggleOptionButton,
	RangeToggleRoot,
} from './RangeToggle.styles';
import type { RangeToggleProps } from './RangeToggle.types';

export const RangeToggle = <Value extends string,>({
	ariaLabel,
	onChange,
	options,
	value,
}: RangeToggleProps<Value>) => (
	<RangeToggleRoot aria-label={ariaLabel} role='radiogroup'>
		{options.map((option) => {
			const isActive = option.value === value;

			return (
				<RangeToggleOptionButton
					aria-checked={isActive}
					aria-label={option.ariaLabel ?? option.label}
					isActive={isActive}
					key={option.value}
					onClick={() => onChange(option.value)}
					role='radio'
					type='button'
				>
					{option.icon}
					{option.label}
				</RangeToggleOptionButton>
			);
		})}
	</RangeToggleRoot>
);
