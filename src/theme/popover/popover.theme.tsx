import type { CSSObject } from '@mui/system';

import { spacing } from '../spacing/spacing.theme';
import { zIndexPopover } from '../zIndex';

const popoverStyles = (): Record<string, CSSObject> => {
	return {
		root: {
			zIndex: zIndexPopover,
			borderRadius: spacing.mediumSmall,
		},
	};
};

export default popoverStyles;
