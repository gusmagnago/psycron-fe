import { inputLabelClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { AppPalette } from '@psycron/theme/palette/palette.types';

const labelStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { text, tertiary, brand } = palette as unknown as AppPalette;

	return {
		root: {
			marginLeft: '15px',
			color: brand.purple,
			[`&.${inputLabelClasses.focused}`]: {
				marginTop: 0,
				color: text.secondary,
			},
			[`&.${inputLabelClasses.disabled}`]: {
				color: tertiary.dark,
				zIndex: '1',
			},
			'&::first-letter': {
				textTransform: 'uppercase',
			},
		},
	};
};

export default labelStyles;
