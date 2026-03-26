export interface IJupiterTip {
	actionLabel?: string;
	ariaLabel?: string;
	onAction?: () => void;
	onDismiss?: () => void;
	text: string;
	title: string;
}
