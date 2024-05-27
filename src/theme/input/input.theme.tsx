import { inputBaseClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';

import { shadowInnerPress } from '../shadow/shadow.theme';

const inputStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { text , gray} = palette as unknown as Palette;

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
			[`&.${inputBaseClasses.disabled}`]: {
				backgroundColor: gray['02']
			}
		},
	};
};

export default inputStyles;
