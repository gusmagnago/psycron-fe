import { outlinedInputClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { type CSSObject } from '@mui/system';
import type { AppPalette } from '@psycron/theme/palette/palette.types';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

const inputOutlinedStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { text, tertiary, brand, error } = palette as unknown as AppPalette;

	return {
		root: {
			borderRadius: `calc(2 * ${spacing.mediumSmall})`,
			color: text.primary,
			[`&.${outlinedInputClasses.disabled}`]: {
				backgroundColor: tertiary.action.disabled,
				borderColor: tertiary.main,
			},
			[`& .${outlinedInputClasses.notchedOutline}`]: {
				borderColor: brand.purple,
			},

			[`&:hover .${outlinedInputClasses.notchedOutline}`]: {
				borderColor: tertiary.main,
			},

			[`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
				{
					borderColor: brand.purple,
					borderWidth: 2,
				},

			[`&.${outlinedInputClasses.error} .${outlinedInputClasses.notchedOutline}`]:
				{
					borderColor: error.main,
				},

			[`&.${outlinedInputClasses.disabled} .${outlinedInputClasses.notchedOutline}`]:
				{
					borderColor: tertiary.action.disabled,
				},
		},
	};
};

export default inputOutlinedStyles;
