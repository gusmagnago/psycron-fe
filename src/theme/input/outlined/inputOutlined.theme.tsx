import { outlinedInputClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';
import { shadowInnerPress } from '@psycron/theme/shadow/shadow.theme';

const inputOutlinedStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { text, gray } = palette as unknown as Palette;

	return {
		root: {
			borderRadius: '40px',

			height: '50px',
			padding: '20px',
			boxShadow: shadowInnerPress,
			color: text.primary,
			margin: '4px 8px',
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
	};
};

export default inputOutlinedStyles;
