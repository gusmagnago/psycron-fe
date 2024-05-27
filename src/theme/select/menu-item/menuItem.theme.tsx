import { menuItemClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';
import { shadowDisabled } from '@psycron/theme/shadow/shadow.theme';

const menuItemStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { tertiary } = palette as unknown as Palette;

	return {
		root: {
			[`&.${menuItemClasses.divider}`]: {
				borderBottom: `1px solid ${tertiary.action.hover}`,
				filter: shadowDisabled,
			},
			'&:hover': {
				backgroundColor: tertiary.main,
			},
			[`&.${menuItemClasses.focusVisible}`]: {
				backgroundColor: tertiary.surface.press,
			},
		},
	};
};

export default menuItemStyles;
