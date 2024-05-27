import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';

import { shadowDisabled,shadowMain, shadowPress } from '../shadow/shadow.theme';
import { generateBorder } from '../variants';



const buttonStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const {
		primary,
		secondary,
		text: { primary: textPrimary, disabled: textDisabled },
	} = palette as unknown as Palette;


	return {
		root: {
			borderRadius: '40px',
			textTransform: 'none',
			fontSize: '1.25em',
			fontWeight: '300',
			color: textPrimary,
			boxShadow: shadowMain,
			margin: '4px 8px'
		},
		sizeLarge: {
			padding: '8px 24px',
		},
		sizeMedium: {
			padding: '6px 20px',
		},
		sizeSmall: {
			padding: '4px 16px',
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
			border: `4px solid ${primary.main}`,
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
			border: `4px solid ${secondary.main}`,
			backgroundColor: 'transparent',
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
