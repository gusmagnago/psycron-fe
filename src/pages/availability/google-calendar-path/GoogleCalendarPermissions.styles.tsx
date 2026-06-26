import { Box, styled, Typography } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMedium,
	shadowMediumPurple,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// Matches the preview's BoxShellAtom: a plain white card with a soft shadow.
export const PermissionsCard = styled(Box)`
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

export const PermissionsIntro = styled(Typography)`
	font-size: 14px;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const PermissionList = styled('ul')`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	margin: 0;
	padding: 0;
	list-style: none;
`;

export const PermissionItem = styled('li')`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.xs};
	font-size: 13px;
	line-height: 1.45;
	color: ${palette.text.primary};

	& svg {
		width: 15px;
		height: 15px;
		flex-shrink: 0;
		margin-top: 2px;
		color: ${palette.brand.purple};
	}
`;

// Matches the preview's BoxMuted (12px, secondary, not italic).
export const PrivacyNote = styled(Typography)`
	font-size: 12px;
	color: ${palette.text.secondary};
	margin: 0;
	text-align: left;
`;

// Row: compact "Back" beside the full-width primary "Allow access".
export const ButtonRow = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: ${spacing.xs};
	margin-top: ${spacing.xxs};
`;

// Compact neumorphic "Back" chip with a leading arrow.
export const BackButton = styled(Button)`
	flex-shrink: 0;
	border-radius: calc(2 * ${spacing.mediumSmall});
	padding: ${spacing.xs} ${spacing.small};
	font-size: 13px;
	font-weight: 600;
	text-transform: none;
	background-color: ${palette.background.default};
	color: ${palette.text.primary};
	box-shadow: ${shadowMedium};
	gap: ${spacing.xxs};

	& svg {
		width: 16px;
		height: 16px;
	}

	&:hover {
		background-color: ${palette.white};
		box-shadow: ${shadowSmall};
		color: ${palette.brand.purple};
	}
`;

// Full-width primary chip (the preview's "Allow access"): light purple fill,
// purple text, purple shadow.
export const ContinueBtn = styled(Button)`
	width: 100%;
	border-radius: calc(2 * ${spacing.mediumSmall});
	padding: ${spacing.xs} ${spacing.small};
	font-size: 13px;
	font-weight: 600;
	text-transform: none;
	background-color: ${palette.brand.light};
	color: ${palette.brand.purple};
	box-shadow: ${shadowMediumPurple};

	// The shared Button content wrapper is position: relative by default (for the
	// loader); drop it here so it doesn't create a stacking context.
	& > :first-of-type {
		position: static;
	}

	&:hover {
		background-color: ${palette.brand.light};
		box-shadow: ${shadowSmall};
		color: ${palette.brand.purple};
	}
`;
