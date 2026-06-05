import type { TooltipProps } from '@mui/material';

export interface PsycronTooltipProps extends TooltipProps {
	disabled?: boolean;
	// Opt out of the default purple hover fill/glow when the wrapping
	// component supplies its own hover treatment (e.g. the navigation rail).
	plainHover?: boolean;
}
