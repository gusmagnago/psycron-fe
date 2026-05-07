import { checkboxClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';

import type { AppPalette } from '../palette/palette.types';

const checkboxStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { brand, tertiary } = palette as unknown as AppPalette;

	return {
		root: {
			color: brand.purple,
			[`&.${checkboxClasses.checked}`]: {
				color: brand.purple,
			},
			[`&.${checkboxClasses.disabled}`]: {
				color: tertiary.action.disabled,
			},
		},
	};
};

export default checkboxStyles;
