import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ChartRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	height: 100%;
`;

export const ChartCanvas = styled(Box)`
	display: flex;
	align-items: flex-end;
	gap: 12px;
	flex: 1;
	min-height: 80px;
`;

export const BarGroup = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isToday',
})<{ isToday: boolean }>`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	cursor: default;

	&[role='button'] {
		cursor: pointer;
	}

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 4px;
		border-radius: 8px;
	}

	& > .bar-stack {
		width: 100%;
		border-radius: 6px 6px 0 0;
		overflow: hidden;
		display: flex;
		flex-direction: column-reverse;
		outline: ${({ isToday }) =>
			isToday ? `2px solid ${palette.tertiary.main}` : 'none'};
		outline-offset: 2px;
	}
`;

export const BarSegment = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'color' && prop !== 'heightPct',
})<{ color: string; heightPct: number }>`
	width: 100%;
	height: ${({ heightPct }) => heightPct}%;
	background: ${({ color }) => color};
	transition: height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	min-height: ${({ heightPct }) => (heightPct > 0 ? '3px' : '0')};
`;

export const BarLabel = styled.span<{ isToday: boolean }>`
	font-size: 11px;
	font-weight: ${({ isToday }) => (isToday ? 700 : 400)};
	color: ${({ isToday }) =>
		isToday ? palette.tertiary.main : palette.text.secondary};
`;

export const ChartLegend = styled(Box)`
	display: flex;
	gap: ${spacing.medium};
	flex-wrap: wrap;
`;

export const LegendItem = styled(Box)`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	color: ${palette.text.secondary};
`;

export const LegendDot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'color',
})<{ color: string }>`
	width: 10px;
	height: 10px;
	border-radius: 3px;
	background: ${({ color }) => color};
	flex-shrink: 0;
`;
