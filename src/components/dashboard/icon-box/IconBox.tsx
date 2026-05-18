import { IconBoxRoot } from './IconBox.styles';
import type { IconBoxProps } from './IconBox.types';

export const IconBox = ({
	children,
	size = 40,
	tone = 'neutral',
	...rest
}: IconBoxProps) => (
	<IconBoxRoot size={size} tone={tone} {...rest}>
		{children}
	</IconBoxRoot>
);
