import { StatusChipRoot } from './StatusChip.styles';
import type { StatusChipProps } from './StatusChip.types';

export const StatusChip = ({
	children,
	leadingDot = false,
	tone = 'neutral',
	variant = 'filled',
	...rest
}: StatusChipProps) => (
	<StatusChipRoot
		leadingDot={leadingDot}
		tone={tone}
		variant={variant}
		{...rest}
	>
		{children}
	</StatusChipRoot>
);
