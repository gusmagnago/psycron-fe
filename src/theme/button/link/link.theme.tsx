import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';
import { shadowDisabled, shadowMain, shadowPress } from '@psycron/theme/shadow/shadow.theme';



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
			textDecoration: 'none'
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
