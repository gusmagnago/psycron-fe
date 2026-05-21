import type { Theme } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';

import type { AppPalette } from '../palette/palette.types';
import { shadowSmall } from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';
import { zIndexAlert } from '../zIndex';

export const alertStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { success, error, info, alert } = palette as unknown as AppPalette;

	return {
		root: {
			borderRadius: `${spacing.mediumSmall}`,
			margin: `${spacing.mediumSmall}`,
			boxShadow: shadowSmall,
			zIndex: zIndexAlert,
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

export const snackBarStyles = (): Record<string, CSSObject> => {
	return {
		root: {
			zIndex: zIndexAlert,
		},
	};
};
