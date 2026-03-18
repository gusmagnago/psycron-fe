import type { CSSObject } from '@mui/system';

import { zIndexModal } from '../zIndex';

const popoverStyles = (): Record<string, CSSObject> => {
	return {
		root: {
			zIndex: zIndexModal + 1,
		},
	};
};

export default popoverStyles;
