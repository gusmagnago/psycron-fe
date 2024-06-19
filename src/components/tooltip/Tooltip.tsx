import type { TooltipProps } from '@mui/material';
import { IconButton, Tooltip as MUITooltip } from '@mui/material';

export const Tooltip = ({ children, ...rest }: TooltipProps) => {
	return (
		<MUITooltip arrow {...rest}>
			<IconButton>{children}</IconButton>
		</MUITooltip>
	);
};
