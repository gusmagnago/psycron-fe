import { Tooltip as MUITooltip } from '@mui/material';
import { Text } from '@psycron/components/text/Text';

import { TootleTipIconButton } from './Tooltip.styles';
import type { PsycronTooltipProps } from './Tooltip.types';

export const Tooltip = ({
	children,
	onClick,
	placement,
	title,
	open,
	disabled = false,
	plainHover = false,
	'aria-label': ariaLabel,
}: PsycronTooltipProps) => {
	const Title =
		typeof title === 'string' || typeof title === 'number' ? (
			<Text isFirstUpper fontSize={'0.7rem'}>
				{title}
			</Text>
		) : (
			title
		);

	const isControlled = typeof open === 'boolean';

	return (
		<MUITooltip
			arrow
			placement={placement}
			title={disabled ? '' : Title}
			open={disabled ? false : isControlled ? open : undefined}
			disableHoverListener={disabled}
			disableFocusListener={disabled}
			disableTouchListener={disabled}
		>
			<span
				style={{
					display: 'inline-flex',
					cursor: disabled ? 'not-allowed' : 'pointer',
				}}
			>
				<TootleTipIconButton
					aria-label={
						ariaLabel ??
						(typeof title === 'string' || typeof title === 'number'
							? String(title)
							: undefined)
					}
					disabled={disabled}
					$plainHover={plainHover}
					onClick={onClick}
				>
					{children}
				</TootleTipIconButton>
			</span>
		</MUITooltip>
	);
};
