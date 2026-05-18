export interface ThisWeekData {
	blocked: number;
	cancelled: number;
	completed: number;
	delta?: number;
	upcoming: number;
}

export type ThisWeekViewMode = 'month' | 'week';

export interface ThisWeekWidgetProps {
	data: ThisWeekData;
	isLoading?: boolean;
	monthData: ThisWeekData;
}
