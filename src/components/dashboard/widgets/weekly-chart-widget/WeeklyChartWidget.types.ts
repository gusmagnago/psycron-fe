export interface WeeklyBarData {
	blocked: number;
	booked: number;
	cancelled: number;
	completed: number;
	date: string;
	isToday: boolean;
	label: string;
	upcoming: number;
}

export interface WeeklyChartWidgetProps {
	data: WeeklyBarData[];
	isLoading?: boolean;
	onDayClick?: (day: WeeklyBarData) => void;
}
