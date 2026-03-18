import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';

import {
	shadowDisabled,
	shadowMain,
	shadowPress,
} from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';
import { generateBorder } from '../variants';

const buttonStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const {
		primary,
		secondary,
		brand,
		tertiary,
		gray,
		error,
		info,
		success,
		warning,
		text: { primary: textPrimary, disabled: textDisabled },
	} = palette as unknown as Palette;

	return {
		root: {
			borderRadius: `calc(2 * ${spacing.mediumSmall})`,
			fontSize: '1em',
			fontWeight: '500',
			color: textPrimary,
			textTransform: 'inherit',
			height: '40px',
		},
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
		containedPrimary: {
			backgroundColor: primary.main,
			'&:hover': {
				backgroundColor: primary.action.hover,
				boxShadow: shadowMain,
			},
			'&:focus': {
				backgroundColor: primary.action.press,
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				backgroundColor: primary.action.disabled,
				color: textDisabled,
				filter: shadowDisabled,
				pointerEvents: 'none',
			},
		},
		containedSecondary: {
			backgroundColor: secondary.main,
			'&:hover': {
				backgroundColor: secondary.action.hover,
				boxShadow: shadowPress,
			},
			'&:focus': {
				backgroundColor: secondary.action.press,
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				backgroundColor: secondary.action.disabled,
				color: textDisabled,
				filter: shadowDisabled,
				pointerEvents: 'none',
			},
		},
		containedTertiary: {
			backgroundColor: tertiary.main,
			color: tertiary.light,
			'&:hover': {
				backgroundColor: tertiary.action.hover,
				boxShadow: shadowPress,
			},
			'&:focus': {
				backgroundColor: tertiary.action.press,
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				backgroundColor: tertiary.action.disabled,
				color: textDisabled,
				filter: shadowDisabled,
				pointerEvents: 'none',
			},
		},
		outlinedPrimary: {
			border: `2px solid ${primary.main}`,
			boxSizing: 'border-box',
			backgroundColor: 'transparent',
			'&:hover': {
				backgroundColor: primary.action.hover,
				border: generateBorder(primary.action.hover),
				boxShadow: shadowMain,
			},
			'&:focus': {
				border: generateBorder(primary.action.press),
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				border: generateBorder(primary.action.disabled),
				color: textDisabled,
				filter: shadowDisabled,
				pointerEvents: 'none',
			},
		},
		outlinedSecondary: {
			border: `2px solid ${secondary.main}`,
			backgroundColor: 'transparent',
			boxSizing: 'border-box',
			'&:hover': {
				backgroundColor: secondary.action.hover,
				border: generateBorder(secondary.action.hover),
				boxShadow: shadowMain,
			},
			'&:focus': {
				border: generateBorder(secondary.action.press),
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				border: generateBorder(secondary.action.disabled),
				filter: shadowDisabled,
				color: textDisabled,
				pointerEvents: 'none',
			},
		},
		outlinedTertiary: {
			border: `2px solid ${brand.purple}`,
			backgroundColor: 'transparent',
			boxSizing: 'border-box',
			'&:hover': {
				backgroundColor: brand.dark,
				boxShadow: shadowMain,
				color: gray['01'],
			},
			'&:focus': {
				border: generateBorder(brand.dark),
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				border: generateBorder(tertiary.action.disabled),
				filter: shadowDisabled,
				color: textDisabled,
				pointerEvents: 'none',
			},
		},
		outlinedError: {
			border: `2px solid ${error.main}`,
			backgroundColor: 'transparent',
			boxSizing: 'border-box',
			color: error.main,
			'&:hover': {
				backgroundColor: error.surface.hover,
				border: generateBorder(error.action.hover),
				boxShadow: shadowMain,
			},
			'&:focus': {
				border: generateBorder(error.action.press),
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				border: generateBorder(error.action.disabled),
				color: textDisabled,
				filter: shadowDisabled,
				pointerEvents: 'none',
			},
		},
		outlinedSuccess: {
			border: `2px solid ${success.main}`,
			backgroundColor: 'transparent',
			boxSizing: 'border-box',
			color: success.dark,
			'&:hover': {
				backgroundColor: success.surface.hover,
				border: generateBorder(success.action.hover),
				boxShadow: shadowMain,
			},
			'&:focus': {
				border: generateBorder(success.action.press),
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				border: generateBorder(success.action.disabled),
				color: textDisabled,
				filter: shadowDisabled,
				pointerEvents: 'none',
			},
		},
		outlinedInfo: {
			border: `2px solid ${info.main}`,
			backgroundColor: 'transparent',
			boxSizing: 'border-box',
			color: info.main,
			'&:hover': {
				backgroundColor: info.surface.hover,
				border: generateBorder(info.action.hover),
				boxShadow: shadowMain,
			},
			'&:focus': {
				border: generateBorder(info.action.press),
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				border: generateBorder(info.action.disabled),
				color: textDisabled,
				filter: shadowDisabled,
				pointerEvents: 'none',
			},
		},
		outlinedWarning: {
			border: `2px solid ${warning.main}`,
			backgroundColor: 'transparent',
			boxSizing: 'border-box',
			color: warning.dark,
			'&:hover': {
				backgroundColor: warning.surface.hover,
				border: generateBorder(warning.action.hover),
				boxShadow: shadowMain,
			},
			'&:focus': {
				border: generateBorder(warning.action.press),
				boxShadow: shadowPress,
			},
			'&.Mui-disabled': {
				border: generateBorder(warning.action.disabled),
				color: textDisabled,
				filter: shadowDisabled,
				pointerEvents: 'none',
			},
		},
	};
};

export default buttonStyles;
