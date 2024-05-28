import { paginationItemClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';

import { shadowDisabled, shadowMain } from '../shadow/shadow.theme';

const paginationItemStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { secondary, background } = palette as unknown as Palette;
	return {
		root: {
			'.MuiSvgIcon-root': {
				color: secondary.action.press,
				filter: shadowDisabled,
			},
			[`&.${paginationItemClasses.selected}`]: {
				boxShadow: shadowMain,
				backgroundColor: background.default
			}
		},
	};
};

export default paginationItemStyles;
