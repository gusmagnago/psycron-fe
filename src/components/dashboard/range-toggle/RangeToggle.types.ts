import type { ReactNode } from 'react';

export interface RangeToggleOption<Value extends string = string> {
	ariaLabel?: string;
	icon?: ReactNode;
	label: string;
	value: Value;
}

export interface RangeToggleProps<Value extends string = string> {
	ariaLabel: string;
	onChange: (value: Value) => void;
	options: RangeToggleOption<Value>[];
	value: Value;
}
