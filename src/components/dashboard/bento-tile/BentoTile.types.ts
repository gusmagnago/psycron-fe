import type { CSSProperties, ReactNode } from 'react';
import type { WidgetInfoId } from '@psycron/components/dashboard/widget-info-modal/WidgetInfoModal.types';
import type {
	DashboardTileId,
	DashboardTileOrientation,
} from '@psycron/pages/dashboard/Dashboard.types';

export type BentoTileVariant = 'default' | 'greeting' | 'jupiter';

export interface BentoTileProps {
	ariaLabel: string;
	children: ReactNode;
	colSpan?: number;
	id: DashboardTileId;
	index?: number;
	isEditMode?: boolean;
	isHidden?: boolean;
	onResize?: (id: DashboardTileId, delta: number) => void;
	onResizeWidth?: (id: DashboardTileId, delta: number) => void;
	onToggleOrientation?: (
		id: DashboardTileId,
		orientation?: DashboardTileOrientation
	) => void;
	onToggleVisibility?: (id: DashboardTileId) => void;
	orientation?: DashboardTileOrientation;
	rowSpan?: number;
	style?: CSSProperties;
	tier?: string;
	variant?: BentoTileVariant;
	widgetInfoId?: WidgetInfoId;
}
