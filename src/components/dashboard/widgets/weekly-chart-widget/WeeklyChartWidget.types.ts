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

export type ChartViewMode = 'month' | 'week';

export interface WeeklyChartWidgetProps {
	data: WeeklyBarData[];
	isLoading?: boolean;
	monthData: WeeklyBarData[];
	onDayClick?: (day: WeeklyBarData) => void;
}
