import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import type { Palette } from '@psycron/theme/palette/palette.types';

import { shadowSmall } from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';

const paperStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { background } = palette as unknown as Palette;

	return {
		root: {
			borderRadius: `${spacing.mediumSmall}`,
			backgroundColor: background.default,
			boxShadow: shadowSmall,
		},
	};
};

export default paperStyles;
