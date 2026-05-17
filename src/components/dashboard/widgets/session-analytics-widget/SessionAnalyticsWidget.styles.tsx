import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowGlassShimmer } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { SessionAnalyticsLayout } from './SessionAnalyticsWidget.types';

export const COLORS = {
	blocked: palette.alert.main,
	cancelled: palette.error.main,
	completed: palette.success.main,
	upcoming: palette.primary.main,
} as const;

export const AnalyticsRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	height: 100%;
`;

export const GlassPanel = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'layout',
})<{ layout: SessionAnalyticsLayout }>`
	align-items: stretch;
	background:
		linear-gradient(
			160deg,
			${hexToRgba(palette.white, 0.72)},
			${hexToRgba(palette.primary.surface.light, 0.5)}
		),
		${hexToRgba(palette.white, 0.34)};
	border-radius: ${spacing.small};
	box-shadow: ${shadowGlassShimmer};
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.medium};
	min-height: 0;
	overflow: hidden;
	padding: ${spacing.small};

	${isBiggerThanMediumMedia} {
		flex-direction: ${({ layout }) => layout};
	}
`;

export const KpiBlock = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'layout',
})<{ layout?: SessionAnalyticsLayout }>`
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	gap: ${spacing.small};
	width: 100%;

	${isBiggerThanMediumMedia} {
		width: ${({ layout }) => (layout === 'column' ? '100%' : '38%')};
	}
`;

export const KpiHero = styled(Box)`
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const CompletionRateValue = styled.span<{ rateColor: string }>`
	font-size: 42px;
	font-weight: 800;
	color: ${({ rateColor }) => rateColor};
	line-height: 1;

	${isBiggerThanMediumMedia} {
		font-size: 58px;
	}
`;

export const CompletionRateLabel = styled.span`
	font-size: 12px;
	color: ${palette.text.secondary};
	text-transform: none;
`;

export const KpiInsight = styled(Box)`
	align-items: flex-start;
	background: ${palette.tertiary.surface.light};
	border: 1px solid ${hexToRgba(palette.tertiary.main, 0.28)};
	border-radius: ${spacing.xs};
	color: ${palette.text.secondary};
	display: grid;
	font-size: 12px;
	gap: ${spacing.xs};
	grid-template-columns: auto minmax(0, 1fr);
	line-height: 1.4;
	padding: ${spacing.xs};

	& svg {
		color: ${palette.brand.purple};
		height: ${spacing.small};
		width: ${spacing.small};
	}
`;

export const KpiInsightSource = styled.span`
	color: ${palette.text.primary};
	font-weight: 700;
	margin-right: ${spacing.xxs};
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

export const StatGrid = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'layout',
})<{ layout?: SessionAnalyticsLayout }>`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: 1fr;

	${isBiggerThanMediumMedia} {
		grid-template-columns: ${({ layout }) =>
			layout === 'column' ? 'repeat(2, minmax(0, 1fr))' : '1fr'};
	}
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
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 120px;
	min-width: 0;
`;

export const LoadingPanel = styled(Box)`
	display: flex;
	gap: ${spacing.small};
	width: 100%;
`;

export const LoadingKpi = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	width: 38%;
`;

export const LoadingChart = styled(Box)`
	align-items: flex-end;
	display: flex;
	flex: 1;
	gap: ${spacing.xs};
	min-height: 80px;
`;

export const ChartSkeletonBar = styled(Skeleton)`
	border-radius: ${spacing.xs};
	flex: 1;
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
