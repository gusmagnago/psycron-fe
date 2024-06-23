import type { TooltipProps } from '@mui/material';
import { IconButton, Tooltip as MUITooltip } from '@mui/material';

export const Tooltip = ({ children, placement, ...rest }: TooltipProps) => {
	return (
		<MUITooltip arrow {...rest} placement={placement}>
			<IconButton>{children}</IconButton>
		</MUITooltip>
	);
};
