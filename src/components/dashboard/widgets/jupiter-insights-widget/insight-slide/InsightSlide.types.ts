import type { JupiterInsight } from '../JupiterInsightsWidget.types';

export interface InsightSlideProps {
	current: JupiterInsight;
	direction: number;
	idx: number;
}
