import { selectClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { AppPalette } from '@psycron/theme/palette/palette.types';

import { isMobileMedia } from '../media-queries/mediaQueries';
import { shadowDisabled } from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';

const selectStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { primary } = palette as unknown as AppPalette;
	return {
		root: {
			height: 'auto',
			fontSize: '0.95rem',
			'& .MuiTypography-root': {
				fontSize: '0.95rem',
			},
			[isMobileMedia]: {
				marginBottom: spacing.space,
			},
		},
		icon: {
			color: primary.main,
			filter: shadowDisabled,
			[`&.${selectClasses.iconOpen}`]: {
				color: primary.action.press,
				filter: shadowDisabled,
			},
		},
	};
};

export default selectStyles;
