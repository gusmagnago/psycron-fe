import type { DashboardTier, DashboardWidgetInfoId } from '@psycron/api/dashboard/index.types';

export type WidgetInfoId =
	DashboardWidgetInfoId;

export interface WidgetInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	tier?: DashboardTier;
	widgetId: WidgetInfoId;
}
