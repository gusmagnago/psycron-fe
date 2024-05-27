import type { CSSObject } from '@mui/system';

import { shadowDisabled, shadowInnerPress } from '../shadow/shadow.theme';

const progressBarStyles = (): Record<string, CSSObject> => {

	return {
		root: {
			padding: '8px 16px',
			height: '20px',
			boxShadow: shadowInnerPress,
			filter: shadowDisabled,
			margin: '20px',
			borderRadius: '40px'
		},
	};
};

export default progressBarStyles;


