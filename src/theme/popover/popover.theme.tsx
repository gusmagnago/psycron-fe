import type { CSSObject } from '@mui/system';

import { zIndexModalAbove } from '../zIndex';

const popoverStyles = (): Record<string, CSSObject> => {
	return {
		root: {
			zIndex: zIndexModalAbove,
		},
	};
};

export default popoverStyles;
