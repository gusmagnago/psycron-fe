import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';

import type { Palette } from '../palette/palette.types';
import { shadowMain } from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';

const alertStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { success, error, info, alert } = palette as unknown as Palette;

	return {
		root: {
			borderRadius: `${spacing.mediumSmall}`,
			margin: `${spacing.mediumSmall}`,
			boxShadow: shadowMain,
		},
		standardSuccess: {
			backgroundColor: success.surface.light,
			color: success.dark,
		},
		standardInfo: {
			backgroundColor: info.surface.light,
			color: info.dark,
		},
		standardError: {
			backgroundColor: error.surface.light,
			color: error.dark,
		},
		standardWarning: {
			backgroundColor: alert.surface.light,
			color: alert.dark,
		},
	};
};

export default alertStyles;
