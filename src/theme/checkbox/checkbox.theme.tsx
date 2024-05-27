import { checkboxClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';

import type { Palette } from '../palette/palette.types';

const checkboxStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const {
		tertiary
	} = palette as unknown as Palette;

	return {
		'&.Mui-checked': {
			color: tertiary.action.press,
		},
		root: {
			color: tertiary.main,
			[`&.${checkboxClasses.checked}`]: {
				color: tertiary.action.press,
			},
			[`&.${checkboxClasses.disabled}`]: {
				color: tertiary.action.disabled,
			},

		},
	};
};

export default checkboxStyles;
