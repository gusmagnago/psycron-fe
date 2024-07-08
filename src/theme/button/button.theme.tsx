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
		text: { primary: textPrimary, disabled: textDisabled },
	} = palette as unknown as Palette;

	return {
		root: {
			borderRadius: `calc(2 * ${spacing.mediumSmall})`,
			fontSize: '1em',
			fontWeight: '500',
			color: textPrimary,
			boxShadow: shadowMain,
			margin: `${spacing.space} 0`,
			textTransform: 'capitalize',
			height: '40px',
		},
		sizeLarge: {
			padding: `${spacing.xs} ${spacing.medium}`,
			fontSize: '1.25em',
			height: '50px',
		},
		sizeMedium: {
			padding: `${spacing.xxs} ${spacing.mediumSmall}`,
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
			'&:disabled': {
				backgroundColor: primary.action.disabled,
				color: textDisabled,
				filter: shadowDisabled,
			},
		},
		containedSecondary: {
			backgroundColor: secondary.main,
			'&:hover': {
				backgroundColor: secondary.action.hover,
				boxShadow: shadowMain,
			},
			'&:focus': {
				backgroundColor: secondary.action.press,
				boxShadow: shadowPress,
			},
			'&:disabled': {
				backgroundColor: secondary.action.disabled,
				color: textDisabled,
				filter: shadowDisabled,
			},
		},
		outlinedPrimary: {
			border: `2px solid ${primary.main}`,
			boxSizing: 'border-box',
			backgroundColor: 'transparent',
			'&:hover': {
				border: generateBorder(primary.action.hover),
				boxShadow: shadowMain,
			},
			'&:focus': {
				border: generateBorder(primary.action.press),
				boxShadow: shadowPress,
			},
			'&:disabled': {
				border: generateBorder(primary.action.disabled),
				color: textDisabled,
				filter: shadowDisabled,
			},
		},
		outlinedSecondary: {
			border: `2px solid ${secondary.main}`,
			backgroundColor: 'transparent',
			boxSizing: 'border-box',
			'&:hover': {
				border: generateBorder(secondary.action.hover),
				boxShadow: shadowMain,
			},
			'&:focus': {
				border: generateBorder(secondary.action.press),
				boxShadow: shadowPress,
			},
			'&:disabled': {
				border: generateBorder(secondary.action.disabled),
				filter: shadowDisabled,
				color: textDisabled,
			},
		},
	};
};

export default buttonStyles;
