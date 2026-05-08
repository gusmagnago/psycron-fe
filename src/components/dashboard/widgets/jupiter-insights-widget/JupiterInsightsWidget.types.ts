export interface JupiterInsight {
	actionLabel?: string;
	category?: string;
	id: string;
	onAction?: () => void;
	onSecondaryAction?: () => void;
	secondaryActionLabel?: string;
	text: string;
	title?: string;
}

export interface JupiterInsightsWidgetProps {
	insights: JupiterInsight[];
	isLoading?: boolean;
}
