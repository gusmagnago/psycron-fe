import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	dashboardAccents,
	type DashboardAccentTone,
} from '@psycron/theme/palette/dashboardAccents';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ReadinessRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	height: 100%;

	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none;
		}
	}
`;

export const ReadinessRingWrap = styled(Box)`
	position: relative;
	width: 52px;
	height: 52px;
	flex-shrink: 0;

	& svg {
		transform: rotate(-90deg);
	}

	& circle {
		transition: stroke-dasharray 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
`;

export const ReadinessRingValue = styled(Text)`
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.8125rem;
	font-weight: 700;
	color: ${palette.text.primary};
	font-variant-numeric: tabular-nums;
`;

export const ReadinessSegments = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const ReadinessRow = styled('button')`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	width: 100%;
	padding: 0;
	border: none;
	background: none;
	text-align: left;
	cursor: pointer;

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 3px;
		border-radius: ${spacing.xs};
	}
`;

export const ReadinessIcon = styled(Box, {
	shouldForwardProp: (prop) => prop !== '$tone',
})<{ $tone: DashboardAccentTone }>`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 34px;
	height: 34px;
	border-radius: 10px;
	box-shadow: ${shadowSmall};
	background: ${({ $tone }) => dashboardAccents[$tone].surface};
	color: ${({ $tone }) =>
		$tone === 'warning'
			? dashboardAccents.warning.contrast
			: dashboardAccents[$tone].main};

	& svg {
		width: 18px;
		height: 18px;
	}
`;

export const ReadinessRowText = styled(Box)`
	flex: 1;
	min-width: 0;
`;

export const ReadinessRowTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.8125rem;
	font-weight: 600;
`;

export const ReadinessRowSub = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.7rem;
`;

export const ReadinessBar = styled(Box)`
	height: 6px;
	margin-top: ${spacing.space};
	border-radius: ${spacing.small};
	background: ${palette.gray['01']};
	overflow: hidden;
`;

export const ReadinessBarFill = styled(Box, {
	shouldForwardProp: (prop) => prop !== '$tone' && prop !== '$pct',
})<{ $pct: number; $tone: DashboardAccentTone }>`
	height: 100%;
	border-radius: ${spacing.small};
	width: ${({ $pct }) => `${Math.max(0, Math.min(100, $pct))}%`};
	background: ${({ $tone }) => dashboardAccents[$tone].main};
	transition: width 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
`;

