export interface IGoogleTimezoneSearch {
	initialValue?: string;
	onTimezoneSelect: (timezoneId: string) => void;
}
