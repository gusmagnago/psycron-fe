import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';
import { shadowDisabled, shadowMain, shadowPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';



const linkStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const {
		secondary,
	} = palette as unknown as Palette;


	return {
		root: {
			textTransform: 'none',
			fontSize: '1.25em',
			fontWeight: '500',
			color: secondary.main,
			textDecoration: 'none',
			cursor: 'pointer',
		},
		sizeLarge: {
			padding: `${spacing.space} ${spacing.medium}`,
		},
		sizeMedium: {
			padding: `6px ${spacing.mediumSmall}`,
		},
		sizeSmall: {
			padding: `${spacing.space} ${spacing.small}`,
		},
		'&:hover': {
			color: secondary.action.hover,
			boxShadow: shadowMain,
		},
		'&:focus': {
			color: secondary.action.press,
			boxShadow: shadowPress,
		},
		'&:disabled': {
			color: secondary.action.disabled,
			filter: shadowDisabled,
		},
	};
};

export default linkStyles;
