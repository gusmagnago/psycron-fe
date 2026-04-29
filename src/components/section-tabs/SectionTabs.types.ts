import type { ReactNode } from 'react';

export interface SectionTabItem<Value extends string = string> {
	disabled?: boolean;
	label: ReactNode;
	value: Value;
}

export interface SectionTabsProps<Value extends string = string> {
	ariaLabel: string;
	items: SectionTabItem<Value>[];
	onChange: (value: Value) => void;
	value: Value;
}
