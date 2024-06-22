import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';

const formLabel = ({ palette }: Theme): Record<string, CSSObject> => {
	const { secondary } = palette as unknown as Palette;

	return {
		asterisk: {
			color: secondary.main,
		},
		root: {
			['&.Mui-focused']: {
				color: secondary.action.hover,
			},
		}
	};
};

export default formLabel;
