import { radioClasses } from '@mui/material';
import type { CSSObject, Theme } from '@mui/material/styles';

import type { AppPalette } from '../palette/palette.types';
import { shadowPress } from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';

const radioStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { secondary } = palette as unknown as AppPalette;

	return {
		root: {
			color: secondary.main,
			padding: spacing.xxs,
			'&:hover': {
				color: secondary.action.press,
				backgroundColor: secondary.surface.light,
				boxShadow: shadowPress,
			},
			'&:focus': {
				color: secondary.light,
				backgroundColor: secondary.action.hover,
			},
			[`&.${radioClasses.checked}`]: {
				color: secondary.action.press,
			},
			[`&.${radioClasses.disabled}`]: {
				color: secondary.light,
			},
		},
	};
};

export default radioStyles;
