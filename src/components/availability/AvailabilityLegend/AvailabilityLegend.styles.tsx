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
		prop !== 'color' && prop !== 'borderColor' && prop !== 'swatchOpacity',
})<{ borderColor?: string; color: string; swatchOpacity?: number }>`
	width: 16px;
	height: 16px;
	border-radius: 4px;
	background-color: ${({ color }) => color};
	border: 2px solid ${({ borderColor }) => borderColor ?? 'transparent'};
	opacity: ${({ swatchOpacity }) => swatchOpacity ?? 1};
	flex-shrink: 0;
`;

export const LegendLabel = styled(Typography)`
	font-size: 12px;
	font-weight: 500;
	color: ${palette.gray['05']};
`;
