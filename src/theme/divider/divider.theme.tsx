import type { CSSObject, Theme } from '@mui/material/styles';

import { shadowMedium } from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';

const dividerStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { gray } = palette as unknown as AppPalette;

	return {
		root: {
			color: gray['01'],
			border: `4px solid ${gray['01']}`,
			borderRadius: `calc(2 * ${spacing.mediumSmall})`,
			boxShadow: shadowMedium,
		},
	};
};

export default dividerStyles;
