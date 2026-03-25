import styled from '@emotion/styled';
import { Box, ButtonBase, Typography } from '@mui/material';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMain,
	shadowMedium,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// ─── Occupancy scale ──────────────────────────────────────────────────────────
// Derived from Figma design system node 2242:5489.
// These are intentionally NOT in the palette — they form a feature-specific
// occupancy gradient, not a reusable design token.

export const OCCUPANCY_COLORS = {
	available: palette.background.paper,
	busy: palette.tertiary.main, // #BFA7FF — deeper purple (50–99%)
	empty: palette.gray['02'],
	full: palette.brand.purple, // #683fff — solid brand (100%)
	partial: '#d1c7fb', // medium lilac  (< 50% booked)
} as const;

export type OccupancyLevel = keyof typeof OCCUPANCY_COLORS;

// ─── Card ─────────────────────────────────────────────────────────────────────

export const CalendarCard = styled(Box)`
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
	background: ${palette.background.default};
	border-radius: ${spacing.largeXl};
	box-shadow: ${shadowMain};
	padding: ${spacing.mediumLarge};
	display: flex;
	flex-direction: column;
	gap: ${spacing.mediumSmall};
	flex: 1;
	min-height: 0;
	max-height: 620px;

	${isMobileMedia} {
		max-height: 480px;
		padding: ${spacing.medium};
	}
`;

// ─── Header ───────────────────────────────────────────────────────────────────

export const CalendarHeader = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
`;

export const CalendarTitle = styled(Typography)`
	font-size: 1.2rem;
	font-weight: 500;
	color: ${palette.text.primary};
	line-height: 1.2;
`;

export const CalendarSubtitle = styled(Typography)`
	font-size: 0.875rem;
	color: ${palette.gray['05']};
	margin-top: 2px;
`;


// ─── Weekday labels ───────────────────────────────────────────────────────────

export const WeekdayRow = styled(Box)`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: ${spacing.xs};
`;

export const WeekdayLabel = styled(Typography)`
	text-align: center;
	font-size: 13px;
	font-weight: 500;
	color: ${palette.gray['05']};
	padding: ${spacing.xs} 0;
`;

// ─── Grid ─────────────────────────────────────────────────────────────────────

export const CalendarGrid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-auto-rows: 1fr;
	gap: ${spacing.xs};
	flex: 1;
	min-height: 0;
`;

export const DayCellButton = styled(ButtonBase, {
	shouldForwardProp: (prop) =>
		prop !== 'occupancy' &&
		prop !== 'isOtherMonth' &&
		prop !== 'isClickable' &&
		prop !== 'isToday',
})<{
	isClickable: boolean;
	isOtherMonth: boolean;
	isToday: boolean;
	occupancy: OccupancyLevel;
}>`
	border-radius: 12px;
	font-size: 15px;
	font-weight: 500;
	background-color: ${({ occupancy }) => OCCUPANCY_COLORS[occupancy]};
	color: ${({ occupancy }) =>
		occupancy === 'full' ? palette.white : palette.text.primary};
	border: ${({ isToday }) =>
		isToday ? `2px solid ${palette.secondary.main}` : '2px solid transparent'};
	opacity: ${({ isOtherMonth }) => (isOtherMonth ? 0.3 : 1)};
	cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'default')};
	box-shadow: ${({ isOtherMonth, occupancy }) =>
		isOtherMonth || occupancy == 'empty' ? 'none' : shadowMedium};

	&:hover {
		box-shadow: ${({ isOtherMonth, occupancy }) =>
			isOtherMonth || occupancy == 'empty' ? 'none' : shadowSmall};
	}
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

export const CalendarFooter = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: ${spacing.small};
	padding-top: ${spacing.mediumSmall};
	border-top: 1px solid ${hexToRgba(palette.gray['02'], 0.8)};
`;

export const SourceToggle = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const SourceButton = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	font-size: 12px;
	font-weight: 600;
	padding: ${spacing.xs} ${spacing.small};
	border-radius: 15px;
	transition: all 0.15s ease;
	background-color: ${({ isActive }) =>
		isActive ? palette.brand.purple : 'transparent'};
	color: ${({ isActive }) => (isActive ? '#ffffff' : palette.gray['05'])};
	box-shadow: ${({ isActive }) =>
		isActive
			? '1px 1px 2px rgba(170,170,204,0.5), -1px -1px 2px white'
			: 'none'};

	&:hover {
		color: ${({ isActive }) => (isActive ? '#ffffff' : palette.text.primary)};
	}
`;
