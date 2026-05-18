import type { JupiterInsight } from '../JupiterInsightsWidget.types';

export interface InsightSlideProps {
	current: JupiterInsight;
	direction: number;
	idx: number;
}

export interface InsightActionsProps {
	current: JupiterInsight;
	idx: number;
}
