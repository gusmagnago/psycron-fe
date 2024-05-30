import type { CSSObject } from '@mui/system';

import { shadowDisabled, shadowInnerPress } from '../shadow/shadow.theme';
import { spacing } from '../spacing/spacing.theme';

const progressBarStyles = (): Record<string, CSSObject> => {

	return {
		root: {
			padding: `${spacing.xs} ${spacing.small}`,
			height: `${spacing.mediumSmall}`,
			boxShadow: shadowInnerPress,
			filter: shadowDisabled,
			margin: `${spacing.mediumSmall}`,
			borderRadius: `calc(2 * ${spacing.mediumSmall})`
		},
	};
};

export default progressBarStyles;


