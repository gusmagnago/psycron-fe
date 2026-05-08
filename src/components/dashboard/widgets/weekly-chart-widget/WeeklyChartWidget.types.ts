export interface WeeklyBarData {
	cancelled: number;
	completed: number;
	confirmed: number;
	date: string;
	isToday: boolean;
	label: string;
}

export interface WeeklyChartWidgetProps {
	data: WeeklyBarData[];
	isLoading?: boolean;
}
