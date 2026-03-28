export interface IJupiterHelpCard {
	actionLabel: string;
	description: string;
	disabled?: boolean;
	disabledTooltip?: string;
	onAction: () => void;
	title: string;
}
