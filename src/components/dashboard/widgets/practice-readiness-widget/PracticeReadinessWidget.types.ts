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
	/** Patients detected in the synced calendar, awaiting review/import. */
	importCandidateCount?: number;
	isLoading?: boolean;
	onImportAction?: () => void;
	onSegmentAction: (segment: ReadinessSegmentId) => void;
}

export interface ReadinessSegmentView {
	id: ReadinessSegmentId;
	percentage: number;
	subtitle: string;
	title: string;
}
