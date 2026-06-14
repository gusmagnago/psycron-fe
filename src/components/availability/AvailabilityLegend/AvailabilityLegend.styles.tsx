import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const LegendGroup = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	flex-wrap: wrap;
`;

export const LegendItem = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const LegendSwatch = styled(Box, {
	shouldForwardProp: (prop) =>
		prop !== 'borderColor' &&
		prop !== 'borderSide' &&
		prop !== 'color' &&
		prop !== 'swatchOpacity',
})<{
	borderColor?: string;
	borderSide?: 'all' | 'left';
	color: string;
	swatchOpacity?: number;
}>`
	width: 16px;
	height: 16px;
	border-radius: 4px;
	background-color: ${({ color }) => color};
	opacity: ${({ swatchOpacity }) => swatchOpacity ?? 1};
	flex-shrink: 0;

	${({ borderColor, borderSide }) =>
		borderSide === 'left'
			? `border-left: 4px solid ${borderColor ?? 'transparent'};`
			: `border: 2px solid ${borderColor ?? 'transparent'};`}
`;

export const LegendLabel = styled(Typography)`
	font-size: inherit;
	font-weight: inherit;
	color: ${palette.text.secondary};
`;
