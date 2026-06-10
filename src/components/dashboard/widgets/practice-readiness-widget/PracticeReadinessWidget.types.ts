export type ReadinessSegmentId = 'availability' | 'billing' | 'contacts';

export type ReadinessStatus = 'empty' | 'partial' | 'ready';

export interface PracticeReadinessWidgetProps {
	billingConfigured: number;
	billingPercentage: number;
	billingTotal: number;
	colSpan?: number;
	contactsConfigured: number;
	contactsTotal: number;
	hasAvailability: boolean;
	isLoading?: boolean;
	onSegmentAction: (segment: ReadinessSegmentId) => void;
}

export interface ReadinessSegmentView {
	id: ReadinessSegmentId;
	percentage: number;
	subtitle: string;
	title: string;
}
