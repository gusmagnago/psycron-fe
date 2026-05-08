export interface CustomizeControlProps {
	isCustomizing: boolean;
	onReset?: () => void;
	onToggle: (value: boolean) => void;
}
