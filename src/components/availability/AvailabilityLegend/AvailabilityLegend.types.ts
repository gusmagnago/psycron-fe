export interface AvailabilityLegendItem {
	borderColor?: string;
	borderSide?: 'all' | 'left';
	color: string;
	// Stable, locale-independent identifier — used for the DOM id
	// (legend-item-<itemKey>). Falls back to a slug of `label` when absent.
	itemKey?: string;
	label: string;
	opacity?: number;
}
