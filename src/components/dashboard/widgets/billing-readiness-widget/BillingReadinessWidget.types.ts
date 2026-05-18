export interface BillingReadinessWidgetProps {
	colSpan?: number;
	configuredCount: number;
	isLoading?: boolean;
	missingCount: number;
	onClick: () => void;
	percentage: number;
	status: 'empty' | 'partial' | 'ready';
	totalCount: number;
}

export type BillingStatus = 'empty' | 'partial' | 'ready';
