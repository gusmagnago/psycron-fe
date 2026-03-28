import type { CSSObject } from '@mui/system';

import { spacing } from '../spacing/spacing.theme';
import { zIndexModal } from '../zIndex';

const popoverStyles = (): Record<string, CSSObject> => {
	return {
		root: {
			zIndex: zIndexModal,
			borderRadius: spacing.mediumSmall,
		},
	};
};

export default popoverStyles;
