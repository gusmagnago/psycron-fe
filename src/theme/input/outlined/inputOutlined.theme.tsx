import { outlinedInputClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';
import { shadowInnerPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

const inputOutlinedStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { text, gray } = palette as unknown as Palette;

	return {
		root: {
			borderRadius: `calc(2 * ${spacing.mediumSmall})`,
			height: '50px',
			boxShadow: shadowInnerPress,
			color: text.primary,
			'::before': {
				borderBottom: '0 !important',
			},
			'::after': {
				borderBottom: '0 !important',
			},
			[`&.${outlinedInputClasses.disabled}`]: {
				backgroundColor: gray['02'],
			},
		},
		notchedOutline: {
			border: 'none !important',
		},
		'&:-webkit-autofill': {
			backgroundColor: 'red !important',
		},
		'&:-webkit-autofill:hover': {
			backgroundColor: 'red !important',
		},
		'&:-webkit-autofill:focus': {
			backgroundColor: 'red !important',
		},
		'&:-webkit-autofill:active': {
			backgroundColor: 'red !important',
		},
	};
};

export default inputOutlinedStyles;
