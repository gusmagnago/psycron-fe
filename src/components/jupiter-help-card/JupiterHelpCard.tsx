import { Tooltip } from '@mui/material';
import { Button } from '@psycron/components/button/Button';

import {
	HelpCardDescription,
	HelpCardRoot,
	HelpCardTitle,
} from './JupiterHelpCard.styles';
import type { IJupiterHelpCard } from './JupiterHelpCard.types';

export const JupiterHelpCard = ({
	actionLabel,
	description,
	disabled = false,
	disabledTooltip,
	onAction,
	title,
}: IJupiterHelpCard) => (
	<HelpCardRoot>
		<HelpCardTitle>{title}</HelpCardTitle>
		<HelpCardDescription>{description}</HelpCardDescription>
		<Tooltip arrow title={disabled && disabledTooltip ? disabledTooltip : ''}>
			<span>
				<Button
					disabled={disabled}
					onClick={disabled ? undefined : onAction}
					small
					tertiary
					variant='contained'
				>
					{actionLabel}
				</Button>
			</span>
		</Tooltip>
	</HelpCardRoot>
);
