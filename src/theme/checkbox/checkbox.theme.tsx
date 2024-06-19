import { checkboxClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';

import type { Palette } from '../palette/palette.types';

const checkboxStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const {
		secondary
	} = palette as unknown as Palette;

	return {
		'&.Mui-checked': {
			color: secondary.action.press,
		},
		root: {
			color: secondary.main,
			[`&.${checkboxClasses.checked}`]: {
				color: secondary.action.press,
			},
			[`&.${checkboxClasses.disabled}`]: {
				color: secondary.action.disabled,
			},
		},
	};
};

export default checkboxStyles;
