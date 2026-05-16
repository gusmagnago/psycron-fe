import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const AnalyticsRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	height: 100%;

	${isBiggerThanMediumMedia} {
		flex-direction: row;
	}
`;

export const KpiBlock = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	flex-shrink: 0;
	width: 100%;

	${isBiggerThanMediumMedia} {
		width: 38%;
	}
`;

export const CompletionRateValue = styled.span<{ rateColor: string }>`
	font-size: 36px;
	font-weight: 800;
	color: ${({ rateColor }) => rateColor};
	line-height: 1;
`;

export const CompletionRateLabel = styled.span`
	font-size: 12px;
	color: ${palette.text.secondary};
	margin-bottom: ${spacing.xs};
`;

export const KpiDivider = styled(Box)`
	height: 1px;
	background: ${palette.gray['01']};
	margin: ${spacing.xs} 0;
`;

export const StatRow = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.small};
`;

export const StatLabel = styled.span`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	color: ${palette.text.secondary};
`;

export const StatDot = styled.span<{ color: string }>`
	width: 8px;
	height: 8px;
	border-radius: 2px;
	background: ${({ color }) => color};
	flex-shrink: 0;
`;

export const StatCount = styled.span`
	font-size: 14px;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const BlockedHours = styled.span`
	font-size: 12px;
	color: ${palette.text.secondary};
	margin-top: auto;
	padding-top: ${spacing.xs};
`;

export const ChartSection = styled(Box)`
	flex: 1;
	display: flex;
	flex-direction: column;
	min-width: 0;
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
