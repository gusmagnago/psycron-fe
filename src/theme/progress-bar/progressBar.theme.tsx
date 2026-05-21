import { linearProgressClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';

import type { AppPalette } from '../palette/palette.types';
import { shadowDisabled } from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';

const progressBarStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { secondary } = palette as unknown as AppPalette;

	return {
		root: {
			height: `${spacing.xs}`,
			filter: shadowDisabled,
			margin: `${spacing.small} 0`,
			borderRadius: `calc(2 * ${spacing.mediumSmall})`,
			backgroundColor: secondary.surface.light,
			[`& .${linearProgressClasses.bar}`]: {
				backgroundColor: secondary.main,
				borderRadius: `calc(2 * ${spacing.mediumSmall})`,
			},
		},
	};
};

export default progressBarStyles;
