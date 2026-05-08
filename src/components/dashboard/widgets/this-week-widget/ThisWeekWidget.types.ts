export interface ThisWeekData {
	cancelled: number;
	completed: number;
	delta?: number;
	upcoming: number;
}

export interface ThisWeekWidgetProps {
	data: ThisWeekData;
	isLoading?: boolean;
}
