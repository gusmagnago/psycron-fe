import type { CSSProperties, ReactNode } from 'react';
import type { DashboardTileId } from '@psycron/pages/dashboard/Dashboard.types';

export type BentoTileVariant = 'default' | 'jupiter';

export interface BentoTileProps {
	ariaLabel: string;
	children: ReactNode;
	colSpan?: number;
	id: DashboardTileId;
	index?: number;
	isEditMode?: boolean;
	isHidden?: boolean;
	onResize?: (id: DashboardTileId, delta: number) => void;
	onToggleVisibility?: (id: DashboardTileId) => void;
	rowSpan?: number;
	style?: CSSProperties;
	variant?: BentoTileVariant;
}

export interface BentoTileHeaderChromeProps {
	headerActions?: ReactNode;
	icon?: ReactNode;
	title?: ReactNode;
}

export interface BentoTileFooterChromeProps {
	actions?: ReactNode;
	expandedContent?: ReactNode;
	footer?: ReactNode;
	onExpand: () => void;
	readMoreLabel: string;
}

export interface BentoTileEditControlLabels {
	hide: string;
	resizeDown: string;
	resizeDownAria: string;
	resizeUp: string;
	resizeUpAria: string;
	show: string;
}

export interface BentoTileEditControlsProps {
	isHidden?: boolean;
	labels: BentoTileEditControlLabels;
	onHideToggle?: () => void;
	onResizeDown?: () => void;
	onResizeUp?: () => void;
}

export interface BentoTileExpandedModalProps
	extends BentoTileHeaderChromeProps {
	closeLabel: string;
	expandedContent?: ReactNode;
	footer?: ReactNode;
	onClose: () => void;
	open: boolean;
}
