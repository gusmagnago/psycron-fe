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
	onToggleVisibility?: (id: DashboardTileId) => void;
	rowSpan?: number;
	style?: CSSProperties;
	variant?: BentoTileVariant;
}
