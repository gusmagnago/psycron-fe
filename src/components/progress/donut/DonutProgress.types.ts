export type DonutProgressTone =
	| 'alert'
	| 'error'
	| 'info'
	| 'primary'
	| 'success'
	| 'warning';

export interface DonutProgressProps {
	label: string;
	meta?: string;
	tone?: DonutProgressTone;
	value: number;
}
