import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, ButtonBase, Skeleton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type {
	AvailabilityMiniCalendarDayState,
	AvailabilityMiniCalendarHeatLevel,
} from './AvailabilityMiniCalendar.types';

// Fixed booked-weight heatmap: brand purple at increasing opacity so the same
// load reads identically across months. Text flips to white once the tint is
// dark enough to keep the day number legible.
const HEAT_STEPS: Record<
	AvailabilityMiniCalendarHeatLevel,
	{ background: string; color: string } | null
> = {
	0: null,
	1: { background: hexToRgba(palette.brand.purple, 0.12), color: palette.brand.dark },
	2: { background: hexToRgba(palette.brand.purple, 0.28), color: palette.brand.dark },
	3: { background: hexToRgba(palette.brand.purple, 0.46), color: palette.white },
	4: { background: hexToRgba(palette.brand.purple, 0.66), color: palette.white },
	5: { background: hexToRgba(palette.brand.purple, 0.85), color: palette.white },
};

export const MiniCalendarCard = styled(Box)`
	padding: ${spacing.small};
	border-radius: ${spacing.mediumSmall};
	background: ${hexToRgba(palette.background.default, 0.76)};
`;

export const MiniCalendarHead = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: ${spacing.xs};
	margin-bottom: ${spacing.extraSmall};
`;

export const MiniCalendarTitle = styled(Text)`
	font-size: 14px;
	font-weight: 800;
	letter-spacing: 0;
	color: ${palette.text.primary};
`;

export const MiniCalendarNav = styled(Box)`
	display: inline-flex;
	gap: ${spacing.space};
`;

export const MiniCalendarNavButton = styled(ButtonBase)`
	width: 36px;
	height: 36px;
	min-width: 36px;
	min-height: 36px;
	border: 0;
	border-radius: 14px;
	background: transparent;
	color: ${palette.gray['08']};

	&:hover {
		background: ${palette.brand.light};
		color: ${palette.brand.dark};
	}
`;

export const MiniWeekdayGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: ${spacing.space};
	text-align: center;
`;

export const MiniWeekdayLabel = styled(Text)`
	color: ${hexToRgba(palette.black, 0.6)};
	font-size: 11px;
	font-weight: 800;
	padding: ${spacing.space} 0;
`;

export const MiniDayGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: ${spacing.space};
	text-align: center;
`;

export const MiniDaySkeleton = styled(Skeleton)`
	width: 100%;
	aspect-ratio: 1;
	min-height: 34px;
	border-radius: 14px;
	transform: none;
	background-color: ${hexToRgba(palette.brand.purple, 0.1)};
`;

export const MiniDayButton = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'dayState' && prop !== 'heatLevel',
})<{
	dayState: AvailabilityMiniCalendarDayState;
	heatLevel: AvailabilityMiniCalendarHeatLevel;
}>`
	aspect-ratio: 1;
	min-width: 0;
	min-height: 34px;
	border: 0;
	border-radius: 14px;
	color: ${palette.text.primary};
	background: transparent;
	font-size: 12px;
	font-weight: 800;

	${({ dayState, heatLevel }) => {
		if (dayState === 'muted') return null;
		const heat = HEAT_STEPS[heatLevel];
		return (
			heat &&
			css`
				background: ${heat.background};
				color: ${heat.color};
			`
		);
	}}

	${({ dayState }) =>
		dayState === 'muted' &&
		css`
			color: ${palette.text.disabled};
		`}

	${({ dayState }) =>
		dayState === 'selected' &&
		css`
			background: ${palette.brand.purple};
			color: ${palette.white};
		`}

	&:hover {
		background: ${palette.brand.light};
		color: ${palette.brand.dark};
	}
`;
