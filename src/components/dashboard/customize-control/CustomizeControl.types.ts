export interface CustomizeControlProps {
	isCustomizing: boolean;
	onOrganize?: () => void;
	onReset?: () => void;
	onToggle: (value: boolean) => void;
}
