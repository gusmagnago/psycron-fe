import { tooltipClasses } from '@mui/material';
import type { CSSObject, Theme } from '@mui/material/styles';

import type { Palette } from '../palette/palette.types';
import { spacing } from '../spacing/spacing.theme';

const tooltipeStyles = ({ palette }: Theme): Record<string, CSSObject> => {
	const { tertiary, text, background } = palette as unknown as Palette;

	return {
		tooltip: {
			backgroundColor: tertiary.surface.light,
			color: text.primary,
			filter: `drop-shadow(5px 5px 10px ${tertiary.main}) drop-shadow(-5px -5px 10px ${background.paper});`,
			padding: `${spacing.xs} ${spacing.small}`,
			borderRadius: spacing.mediumSmall,
			[`${tooltipClasses.tooltipArrow}`]: {
				backgroundColor: tertiary.surface.light,
			},
		},
		arrow: {
			color: tertiary.surface.light,
		},
	};
};

export default tooltipeStyles;
