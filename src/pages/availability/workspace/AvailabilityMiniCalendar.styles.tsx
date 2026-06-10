import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { AvailabilityMiniCalendarDayState } from './AvailabilityMiniCalendar.types';

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

export const MiniDayButton = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'dayState',
})<{ dayState: AvailabilityMiniCalendarDayState }>`
	aspect-ratio: 1;
	min-width: 0;
	min-height: 34px;
	border: 0;
	border-radius: 14px;
	color: ${palette.text.primary};
	background: transparent;
	font-size: 12px;
	font-weight: 800;

	${({ dayState }) =>
		dayState === 'muted' &&
		css`
			color: ${palette.text.disabled};
		`}

	${({ dayState }) =>
		dayState === 'slots' &&
		css`
			background: ${hexToRgba(palette.brand.purple, 0.08)};
			color: ${palette.brand.dark};
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
