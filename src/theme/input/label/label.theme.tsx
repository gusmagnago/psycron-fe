import { inputLabelClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';

const labelStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const {
		text,
	} = palette as unknown as Palette;

	return {
		root: {
			marginTop: '10px',
			marginLeft: '15px',
			[`&.${inputLabelClasses.focused}`]: {
				marginTop: 0,
				color: text.secondary
			}
		},
	};
};

export default labelStyles;



