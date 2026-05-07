import { menuItemClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { AppPalette } from '@psycron/theme/palette/palette.types';
import { shadowDisabled } from '@psycron/theme/shadow/shadow.theme';

const menuItemStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { primary } = palette as unknown as AppPalette;

	return {
		root: {
			fontSize: '0.95rem',
			'& .MuiTypography-root': {
				fontSize: '0.95rem',
			},
			[`&.${menuItemClasses.divider}`]: {
				borderBottom: `1px solid ${primary.action.hover}`,
				filter: shadowDisabled,
			},
			'&:hover': {
				backgroundColor: primary.surface.light,
			},
			[`&.${menuItemClasses.focusVisible}`]: {
				backgroundColor: primary.surface.light,
			},
		},
	};
};

export default menuItemStyles;
