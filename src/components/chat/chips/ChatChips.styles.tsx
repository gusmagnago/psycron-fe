import { css } from '@emotion/react';
import { Box, Button, styled, TextField } from '@mui/material';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMedium,
	shadowMediumPurple,
	shadowSmall,
	shadowSmallPurple,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// ─── Color tokens (derived from palette) ─────────────────────────────────────

const CHIP_PURPLE = hexToRgba(palette.brand.purple, 0.3);
const CHIP_PURPLE_HOVER = hexToRgba(palette.brand.purple, 0.6);

// ─── Shared animation ────────────────────────────────────────────────────────

const chipFadeInAnimation = css`
	@keyframes chipFadeIn {
		from {
			opacity: 0;
			transform: translateY(${spacing.xs});
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	animation: chipFadeIn 200ms ease-out;
`;

// ─── Chip variant styles ─────────────────────────────────────────────────────

// Neumorphic to match @psycron Button: raised `shadowMedium` at rest,
// pressed `shadowSmall` on hover. Selected chips fill with brand.purple.

const chipVariantDefault = css`
	border: none;
	background-color: ${palette.background.default};
	color: ${palette.text.primary};
	box-shadow: ${shadowMedium};

	&:hover {
		box-shadow: ${shadowSmall};
		color: ${palette.brand.purple};
	}
`;

// Primary = the preview's "recommended" chip: light purple fill, purple text,
// purple shadow (not a solid-purple fill — that's the multi-select checked state).
const chipVariantPrimary = css`
	border: none;
	background-color: ${palette.brand.light};
	color: ${palette.brand.purple};
	font-weight: 600;
	box-shadow: ${shadowMediumPurple};

	&:hover {
		background-color: ${palette.white};
		box-shadow: ${shadowSmall};
		color: ${palette.brand.purple};
	}
`;

// Success/danger match the preview: neumorphic base tinted with the status
// color (green / red text on a soft tint), settling to shadowSmall on hover.
const chipVariantSuccess = css`
	border: none;
	background-color: ${hexToRgba(palette.success.main, 0.1)};
	color: ${palette.success.main};
	font-weight: 600;
	box-shadow: ${shadowMedium};

	&:hover {
		box-shadow: ${shadowSmall};
		background-color: ${palette.white};
		color: ${palette.success.main};
	}
`;

const chipVariantSelected = css`
	border: none;
	background-color: ${palette.brand.purple};
	color: ${palette.background.default};
	font-weight: 500;
	box-shadow: ${shadowSmallPurple};

	&:hover {
		background-color: ${palette.brand.dark};
		color: ${palette.background.default};
	}
`;

const chipVariantDanger = css`
	border: none;
	background-color: ${hexToRgba(palette.error.main, 0.06)};
	color: ${palette.error.main};
	font-weight: 600;
	box-shadow: ${shadowMedium};

	&:hover {
		box-shadow: ${shadowSmall};
		background-color: ${palette.white};
		color: ${palette.error.main};
	}
`;

// Google chip: follows Google's own button guidance — the multicolor logo
// carries the brand, so the label uses the high-contrast neutral ink (AA/AAA)
// rather than low-contrast blue text. The blue tint keeps the chip identifiable.
const chipVariantGoogle = css`
	border: none;
	background-color: ${hexToRgba(palette.brand.google, 0.12)};
	color: ${palette.text.primary};
	box-shadow: ${shadowMedium};

	&:hover {
		box-shadow: ${shadowSmall};
		background-color: ${hexToRgba(palette.brand.google, 0.2)};
		color: ${palette.text.primary};
	}
`;

// ─── Components ──────────────────────────────────────────────────────────────

export const ChipsContainer = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	padding: ${spacing.xs} 0;
	align-items: center;
	justify-content: center;

	${chipFadeInAnimation}
`;

export const ChipButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'chipVariant',
})<{
	chipVariant?:
		| 'google'
		| 'primary'
		| 'secondary'
		| 'outline'
		| 'danger'
		| 'success';
	isSelected?: boolean;
}>`
	border-radius: calc(2 * ${spacing.mediumSmall});
	padding: ${spacing.xs} ${spacing.small};
	font-size: 13px;
	font-weight: 500;
	text-transform: none;
	min-height: 36px;
	line-height: 1.4;
	gap: 7px;
	transition: all 200ms ease-out;
	white-space: nowrap;

	& svg {
		width: 15px;
		height: 15px;
	}

	${({ chipVariant, isSelected }) => {
		if (chipVariant === 'danger') return chipVariantDanger;
		if (chipVariant === 'google') return chipVariantGoogle;
		if (chipVariant === 'primary') return chipVariantPrimary;
		if (chipVariant === 'success') return chipVariantSuccess;
		if (isSelected) return chipVariantSelected;
		return chipVariantDefault;
	}}

	&:disabled {
		opacity: 0.4;
		pointer-events: none;
	}
`;

export const ContinueButton = styled(Button)`
	border-radius: calc(2 * ${spacing.mediumSmall});
	padding: ${spacing.xs} ${spacing.mediumSmall};
	font-size: 14px;
	font-weight: 600;
	text-transform: none;
	min-height: 36px;
	background-color: ${palette.brand.purple};
	color: ${palette.background.default};
	border: none;
	box-shadow: ${shadowMedium};
	transition: all 200ms ease-out;

	${chipFadeInAnimation}

	&:hover {
		background-color: ${palette.brand.dark};
		box-shadow: ${shadowSmall};
	}

	&:disabled {
		opacity: 0.5;
		background-color: ${palette.brand.purple};
		color: ${palette.background.default};
	}
`;

export const OtherInput = styled(TextField)`
	width: 100%;

	& .MuiOutlinedInput-root {
		border-radius: ${spacing.extraSmall};
		font-size: 13px;

		& fieldset {
			border-color: ${CHIP_PURPLE};
		}

		&:hover fieldset {
			border-color: ${CHIP_PURPLE_HOVER};
		}

		&.Mui-focused fieldset {
			border-color: ${palette.brand.purple};
		}
	}
`;

export const OtherInputRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	width: 100%;
	margin-top: ${spacing.xs};
`;

export const OtherSendButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'hasValue',
})<{ hasValue?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 36px;
	height: 36px;
	border: none;
	border-radius: ${spacing.extraSmall};
	background: ${palette.brand.purple};
	color: ${palette.background.default};
	cursor: pointer;
	transition: opacity 0.15s;

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	&:hover:not(:disabled) {
		opacity: 0.85;
	}

	& svg {
		width: 16px;
		height: 16px;
		transition: transform 0.2s ease;
		transform: rotate(${({ hasValue }) => (hasValue ? '-45deg' : '0deg')});
	}
`;

export const OtherBackButton = styled('button')`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 30px;
	height: 30px;
	border: none;
	border-radius: ${spacing.extraSmall};
	background: transparent;
	color: ${palette.brand.purple};
	cursor: pointer;
	opacity: 0.7;
	transition: opacity 0.15s;

	&:hover {
		opacity: 1;
	}

	& svg {
		width: 16px;
		height: 16px;
	}
`;

export const ChipsFadeOut = styled(Box)`
	@keyframes chipsFadeOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
			height: 0;
			overflow: hidden;
		}
	}

	animation: chipsFadeOut 200ms ease-out forwards;
`;
