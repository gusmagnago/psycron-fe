import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';

import type {
	AppPalette,
	ContainedVariantOptions,
	OutlinedVariantOptions,
	VariantStateOptions,
} from '../palette/palette.types';
import {
	shadowDisabled,
	shadowMedium,
	shadowSmall,
} from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';
import { generateBorder } from '../variants';

const createOptionalColorStyle = (
	property: 'backgroundColor' | 'color',
	value?: string
): CSSObject => (value ? { [property]: value } : {});

const createOptionalBorderStyle = (borderColor?: string): CSSObject =>
	borderColor ? { border: generateBorder(borderColor) } : {};

const createStateStyle = ({
	backgroundColor,
	borderColor,
	color,
}: VariantStateOptions): CSSObject => ({
	...createOptionalColorStyle('backgroundColor', backgroundColor),
	...createOptionalBorderStyle(borderColor),
	...createOptionalColorStyle('color', color),
});

const createContainedVariant = ({
	action,
	backgroundColor,
	borderColor,
	color,
	disabled,
	focus,
	hover,
}: ContainedVariantOptions): CSSObject => ({
	backgroundColor,
	...createOptionalBorderStyle(borderColor),
	...createOptionalColorStyle('color', color),
	'&:hover': {
		backgroundColor: hover?.backgroundColor ?? action.hover,
		...createStateStyle({
			borderColor: hover?.borderColor,
		}),
	},
	'&:focus': {
		backgroundColor: focus?.backgroundColor ?? action.press,
		...createStateStyle({
			borderColor: focus?.borderColor,
			color: focus?.color,
		}),
	},
	'&.Mui-disabled': {
		backgroundColor: disabled?.backgroundColor ?? action.disabled,
		...createStateStyle({
			borderColor: disabled?.borderColor,
			color: disabled?.color,
		}),
	},
});

const createOutlinedVariant = ({
	action,
	backgroundColor = 'transparent',
	borderColor,
	color,
	disabled,
	focus,
	hover,
}: OutlinedVariantOptions): CSSObject => {
	return {
		border: generateBorder(borderColor),
		boxSizing: 'border-box',
		backgroundColor,
		...createOptionalColorStyle('color', color),
		'&:hover': {
			...createStateStyle({
				backgroundColor: hover?.backgroundColor,
				borderColor: hover?.borderColor ?? action.hover,
				color: hover?.color,
			}),
		},
		'&:focus': {
			...createStateStyle({
				backgroundColor: focus?.backgroundColor,
				borderColor: focus?.borderColor ?? action.press,
				color: focus?.color,
			}),
		},
		'&.Mui-disabled': {
			...createStateStyle({
				backgroundColor: disabled?.backgroundColor,
				borderColor: disabled?.borderColor ?? action.disabled,
				color: disabled?.color,
			}),
		},
	};
};

const sizeStyles: Record<'sizeLarge' | 'sizeMedium' | 'sizeSmall', CSSObject> =
	{
		sizeLarge: {
			padding: `${spacing.xs} ${spacing.medium}`,
			fontSize: '1.25em',
			height: '50px',
		},
		sizeMedium: {
			padding: `${spacing.xxs} ${spacing.mediumSmall}`,
			height: '42px',
		},
		sizeSmall: {
			padding: `${spacing.space} ${spacing.small}`,
			fontSize: '.75em',
			height: '30px',
		},
	};

const buttonStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const {
		background,
		brand,
		error,
		gray,
		info,
		primary,
		secondary,
		success,
		tertiary,
		warning,
		white,
		text: { disabled: textDisabled, primary: textPrimary },
	} = palette as unknown as AppPalette;

	return {
		root: {
			borderRadius: `calc(2 * ${spacing.mediumSmall})`,
			fontSize: '1em',
			fontWeight: '500',
			color: textPrimary,
			textTransform: 'inherit',
			height: '40px',
			boxShadow: shadowMedium,
			':hover': {
				boxShadow: shadowSmall,
				color: white,
			},
			':disabled': {
				cursor: 'no-drop',
				color: textDisabled,
				filter: shadowDisabled,
			},
		},

		...sizeStyles,

		containedPrimary: createContainedVariant({
			backgroundColor: primary.main,
			action: primary.action,
			hover: {
				backgroundColor: primary.dark,
			},
		}),
		containedSecondary: createContainedVariant({
			backgroundColor: secondary.main,
			action: secondary.action,
		}),
		containedTertiary: createContainedVariant({
			backgroundColor: brand.purple,
			borderColor: brand.purple,
			color: white,
			action: tertiary.action,
			hover: {
				backgroundColor: brand.dark,
				borderColor: brand.dark,
				color: gray['01'],
			},
			focus: {
				backgroundColor: brand.dark,
				borderColor: brand.dark,
			},
			disabled: {
				borderColor: tertiary.action.disabled,
			},
		}),

		outlinedPrimary: createOutlinedVariant({
			borderColor: primary.main,
			action: primary.action,
			hover: {
				backgroundColor: primary.action.hover,
			},
		}),
		outlinedSecondary: createOutlinedVariant({
			borderColor: secondary.main,
			action: secondary.action,
			hover: {
				backgroundColor: secondary.action.hover,
			},
		}),
		outlinedTertiary: createOutlinedVariant({
			borderColor: brand.purple,
			action: tertiary.action,
			backgroundColor: background.default,
			color: brand.purple,
			hover: {
				backgroundColor: brand.dark,
				borderColor: brand.dark,
				color: gray['01'],
			},
			focus: {
				backgroundColor: brand.dark,
				borderColor: brand.dark,
			},
			disabled: {
				backgroundColor: tertiary.action.disabled,
			},
		}),
		outlinedError: createOutlinedVariant({
			borderColor: error.main,
			action: error.action,
			color: error.main,
			hover: {
				backgroundColor: error.main,
				color: white,
			},
		}),
		outlinedSuccess: createOutlinedVariant({
			borderColor: success.main,
			action: success.action,
			color: success.dark,
			hover: {
				backgroundColor: success.surface.hover,
			},
		}),
		outlinedInfo: createOutlinedVariant({
			borderColor: info.main,
			action: info.action,
			color: info.main,
			hover: {
				backgroundColor: info.surface.hover,
			},
		}),
		outlinedWarning: createOutlinedVariant({
			borderColor: warning.main,
			action: warning.action,
			color: warning.dark,
			hover: {
				backgroundColor: warning.surface.hover,
			},
		}),
	};
};

export default buttonStyles;
