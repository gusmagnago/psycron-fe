export interface NotificationFilterChipGroupProps {
	activeValue?: string;
	allLabel: string;
	id?: string;
	items: readonly string[];
	label: string;
	onClear: () => void;
	onSelect: (value: string) => void;
	renderLabel: (value: string) => string;
}
