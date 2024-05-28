import { selectClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';

import { shadowDisabled } from '../shadow/shadow.theme';

const selectStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { secondary, success } = palette as unknown as Palette;
	return {
		root: {
			'.MuiSvgIcon-root': {
				color: secondary.action.press,
				filter: shadowDisabled,
			},
		},
		icon: {
			color: success.main,
			filter: shadowDisabled,
			[`&.${selectClasses.iconOpen}`]: {
				color: secondary.action.press,
				filter: shadowDisabled,
			},
		},
		label: {
			color: 'red'
		}
	};
};

export default selectStyles;
