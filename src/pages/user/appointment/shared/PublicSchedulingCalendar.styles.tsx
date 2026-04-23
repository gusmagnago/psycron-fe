import styled from '@emotion/styled';
import { Box, ButtonBase, IconButton } from '@mui/material';
import {
	isSmallerThanMediumMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type {
	DayTone,
	PublicSchedulingViewMode,
} from './PublicSchedulingCalendar.types';

export const CALENDAR_ICON_COLOR = palette.text.primary;

export const SchedulerWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
`;

export const SchedulerHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const CalendarShell = styled(Box)`
	background: ${palette.white};
	border-radius: ${spacing.large};
	box-shadow: ${shadowSmall};
	display: grid;
	grid-template-columns: minmax(260px, 320px) minmax(0, 1.2fr) minmax(
			280px,
			360px
		);
	min-height: calc(${spacing.xxl} * 11);
	overflow: hidden;
	height: 56.25rem;

	${isSmallerThanTabletMedia} {
		grid-template-columns: 1fr;
		height: 100%;
	}
`;

export const Sidebar = styled(Box)`
	background: ${palette.background.default};
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	padding: ${spacing.large} ${spacing.mediumLarge};

	${isSmallerThanTabletMedia} {
		box-shadow: ${shadowSmall};
	}
`;

export const MainPanel = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	padding: ${spacing.large} ${spacing.mediumLarge};
`;

export const MainHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const MainActions = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	justify-content: space-between;

	${isSmallerThanMediumMedia} {
		flex-wrap: wrap;
	}
`;

export const MainPrimaryActions = styled(Box)`
	display: flex;
`;

export const MainSecondaryActions = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'layoutMode',
})<{ layoutMode: 'below' | 'inline' }>`
	display: flex;
	width: ${({ layoutMode }) => (layoutMode === 'below' ? '100%' : 'auto')};
`;

export const CalendarHeader = styled(Box)`
	align-items: center;
	display: flex;
	justify-content: space-between;
	gap: ${spacing.small};
`;

export const CalendarHeaderActions = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
`;

export const NavIconButton = styled(IconButton)`
	background: ${palette.background.default};
	box-shadow: ${shadowSmall};
	color: ${CALENDAR_ICON_COLOR};

	&:hover {
		background: ${palette.primary.surface.light};
		box-shadow: ${shadowMedium};
	}

	&.Mui-disabled {
		background: ${palette.background.default};
		box-shadow: none;
		color: ${palette.text.disabled};
	}
`;

export const ViewToggle = styled(Box)`
	align-items: center;
	background: ${palette.background.default};
	border-radius: ${spacing.mediumSmall};
	box-shadow: ${shadowSmall};
	display: flex;
	gap: ${spacing.xxs};
	padding: ${spacing.xxs};
`;

export const ViewToggleButton = styled(ButtonBase, {
	shouldForwardProp: (prop) =>
		!['isActive', 'isCompact', 'isTodayButton'].includes(String(prop)),
})<{ isActive: boolean; isCompact: boolean; isTodayButton?: boolean }>`
	background: ${({ isActive, isTodayButton }) =>
		isActive && isTodayButton
			? palette.white
			: isActive
				? palette.brand.purple
				: 'transparent'};
	border: ${({ isActive, isTodayButton }) =>
		isActive && isTodayButton
			? `2px solid ${palette.brand.purple}`
			: '2px solid transparent'};
	border-radius: ${spacing.small};
	color: ${({ isActive, isTodayButton }) =>
		isActive && isTodayButton
			? palette.brand.purple
			: isActive
				? palette.white
				: palette.text.secondary};
	font-size: ${({ isCompact }) => (isCompact ? '0.68rem' : '0.75rem')};
	font-weight: 700;
	letter-spacing: 0.04em;
	padding: ${({ isCompact }) =>
		isCompact
			? `${spacing.xxs} ${spacing.xs}`
			: `${spacing.xs} ${spacing.small}`};
	text-transform: uppercase;

	&:hover {
		color: ${({ isActive, isTodayButton }) =>
			isActive && isTodayButton
				? palette.brand.purple
				: isActive
					? palette.white
					: palette.text.primary};
	}

	&.Mui-disabled {
		color: ${palette.text.disabled};
		opacity: 1;
	}
`;

export const WeekdayRow = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(7, minmax(0, 1fr));
`;

export const WeekdayCell = styled(Box)`
	color: ${palette.gray['05']};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	padding: 0 ${spacing.xs};
	text-align: center;
	text-transform: uppercase;
`;

export const MonthGrid = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'viewMode',
})<{ viewMode: PublicSchedulingViewMode }>`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(7, minmax(0, 1fr));
	grid-auto-rows: 60px;
`;

export const DayCell = styled(ButtonBase, {
	shouldForwardProp: (prop) =>
		![
			'isCurrentMonth',
			'isDisabled',
			'isHighlighted',
			'isSelected',
			'tone',
		].includes(String(prop)),
})<{
	isCurrentMonth: boolean;
	isDisabled: boolean;
	isHighlighted: boolean;
	isSelected: boolean;
	tone: DayTone;
}>`
	align-items: flex-start;
	background: ${({ isHighlighted, isSelected, tone }) => {
		if (isSelected && tone === 'error') return palette.error.main;
		if (isSelected) return palette.brand.purple;
		if (tone === 'error') return palette.error.surface.light;
		if (isHighlighted) return palette.primary.surface.light;
		if (tone === 'success') return palette.success.surface.light;
		if (tone === 'info') return palette.info.surface.light;
		return palette.background.default;
	}};
	border-radius: ${spacing.mediumSmall};
	box-shadow: ${({ isDisabled, isHighlighted, isSelected }) =>
		isDisabled
			? 'none'
			: isSelected || isHighlighted
				? shadowMedium
				: shadowSmall};
	color: ${({ isCurrentMonth, isDisabled, isSelected }) =>
		isSelected
			? palette.white
			: !isCurrentMonth || isDisabled
				? palette.text.disabled
				: palette.text.primary};
	cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: ${spacing.xs};
	text-align: left;
	transition:
		background 0.15s ease,
		box-shadow 0.15s ease;

	&:hover {
		box-shadow: ${({ isDisabled }) => (isDisabled ? 'none' : shadowMedium)};
	}
`;

export const DayNumber = styled(Box)`
	font-size: 1rem;
	font-weight: 700;
	line-height: 1;
`;

export const DayMeta = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	width: 100%;
`;

export const DayIndicators = styled(Box)`
	display: flex;
	gap: ${spacing.xxs};
	min-height: ${spacing.xs};
`;

export const DayIndicator = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: DayTone }>`
	background: ${({ tone }) =>
		tone === 'error'
			? palette.error.main
			: tone === 'success'
				? palette.success.main
				: tone === 'info'
					? palette.info.main
					: palette.gray['04']};
	border-radius: ${spacing.xs};
	height: ${spacing.xs};
	width: ${spacing.xs};
`;

export const DayCount = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	color: ${({ isSelected }) =>
		isSelected ? hexToRgba(palette.white, 0.92) : palette.text.secondary};
	font-size: 0.68rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	line-height: 1;
`;

export const DetailPanel = styled(Box)`
	background: ${palette.background.default};
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	min-height: 0;
	padding: ${spacing.large} ${spacing.mediumLarge};
`;

export const DetailHeader = styled(Box)`
	background: ${palette.background.default};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	position: sticky;
	top: -10px;
	z-index: 1;
`;

export const DetailBody = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.small};
	min-height: 0;
	overflow-y: auto;
	padding-right: ${spacing.xs};
`;
