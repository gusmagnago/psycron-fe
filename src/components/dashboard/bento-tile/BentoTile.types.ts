import type { CSSProperties, ReactNode } from 'react';
import type { DashboardTileId } from '@psycron/pages/dashboard/Dashboard.types';

export type BentoTileVariant = 'default' | 'jupiter';

export interface BentoTileProps {
	ariaLabel: string;
	children: ReactNode;
	colSpan?: number;
	id: DashboardTileId;
	index?: number;
	isDragging?: boolean;
	isEditMode?: boolean;
	isHidden?: boolean;
	onDragEnd?: () => void;
	onDragOver?: (id: DashboardTileId) => void;
	onDragStart?: (id: DashboardTileId) => void;
	onToggleVisibility?: (id: DashboardTileId) => void;
	rowSpan?: number;
	style?: CSSProperties;
	variant?: BentoTileVariant;
}
