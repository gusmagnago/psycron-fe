export type RangeGroupSize = 'medium' | 'small';

export interface RangeGroupOption<Value extends string = string> {
	ariaLabel?: string;
	label: string;
	value: Value;
}

export interface RangeGroupProps<Value extends string = string> {
	ariaLabel: string;
	idPrefix: string;
	onChange: (value: Value) => void;
	options: RangeGroupOption<Value>[];
	size?: RangeGroupSize;
	value: Value;
}
