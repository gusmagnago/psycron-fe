import type { ReactNode } from 'react';

import type { BentoTileHeaderChromeProps } from '../bento-tile-header-chrome/BentoTileHeaderChrome.types';

export interface BentoTileExpandedModalProps extends BentoTileHeaderChromeProps {
	closeLabel: string;
	expandedContent?: ReactNode;
	footer?: ReactNode;
	onClose: () => void;
	open: boolean;
}
