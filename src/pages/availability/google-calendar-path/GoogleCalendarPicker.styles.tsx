import { css } from '@emotion/react';
import { Box, styled, Typography } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowInnerPress,
	shadowMediumPurple,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// Matches the preview's BoxShellAtom: a plain white card with a soft shadow.
export const PickerCard = styled(Box)`
	background-color: ${palette.white};
	border-radius: 18px;
	padding: ${spacing.small};
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	box-shadow: ${shadowSmall};

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	animation: slideIn 300ms ease-out;
`;

export const PickerHeader = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const BackBtn = styled('button')`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: 8px;
	border: none;
	background: ${hexToRgba(palette.brand.purple, 0.08)};
	cursor: pointer;
	transition: background 150ms ease;
	flex-shrink: 0;
	color: ${palette.brand.purple};
	padding: 0;

	&:hover {
		background: ${hexToRgba(palette.brand.purple, 0.16)};
	}

	& svg {
		width: 16px;
		height: 16px;
	}
`;

// Matches the preview's BoxTitle (14px / 700).
export const PickerTitle = styled(Typography)`
	font-size: 14px;
	font-weight: 700;
	color: ${palette.text.primary};
	text-align: left;
`;

export const CalendarList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

// Matches the preview's CalendarOptionAtom: neumorphic inset surface, no border;
// selected fills with a light purple tint and a purple shadow.
export const CalendarOption = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	width: 100%;
	padding: 10px ${spacing.extraSmall};
	border-radius: ${spacing.extraSmall};
	background: ${palette.background.paper};
	box-shadow: ${shadowInnerPress};
	font-size: 13px;
	text-align: left;
	cursor: pointer;
	transition: box-shadow 150ms ease, background 150ms ease;

	${({ isSelected }) =>
		isSelected &&
		css`
			background: ${hexToRgba(palette.brand.purple, 0.06)};
			box-shadow: ${shadowMediumPurple};
		`}
`;

export const CalendarDot = styled(Box)<{ color?: string }>`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	flex-shrink: 0;
	background-color: ${({ color }) => color ?? palette.brand.purple};
`;

export const CalendarName = styled(Typography)`
	font-size: 13px;
	color: ${palette.text.primary};
	flex: 1;
	text-align: left;
`;

// Matches the preview's CalendarBadge: purple text on light purple, bold.
export const PrimaryBadge = styled(Typography)`
	margin-left: auto;
	padding: 2px 7px;
	border-radius: 6px;
	background-color: ${palette.brand.light};
	color: ${palette.brand.purple};
	font-size: 10px;
	font-weight: 700;
`;

// Full-width primary chip (the preview's "Use this calendar"): light purple fill,
// purple text, purple shadow.
export const ConfirmButton = styled(Button)`
	width: 100%;
	border-radius: calc(2 * ${spacing.mediumSmall});
	padding: ${spacing.xs} ${spacing.small};
	font-size: 13px;
	font-weight: 600;
	text-transform: none;
	background-color: ${palette.brand.light};
	color: ${palette.brand.purple};
	box-shadow: ${shadowMediumPurple};

	// Drop the shared content wrapper's position: relative (loader-only).
	& > :first-of-type {
		position: static;
	}

	&:hover {
		background-color: ${palette.brand.light};
		box-shadow: ${shadowSmall};
		color: ${palette.brand.purple};
	}
`;
