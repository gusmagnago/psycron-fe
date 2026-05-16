export interface BentoTileEditControlLabels {
	drag: string;
	dragAria: string;
	hide: string;
	resizeDown: string;
	resizeDownAria: string;
	resizeUp: string;
	resizeUpAria: string;
	show: string;
}

export interface BentoTileEditControlsProps {
	isHidden?: boolean;
	labels: BentoTileEditControlLabels;
	onHideToggle?: () => void;
	onResizeDown?: () => void;
	onResizeUp?: () => void;
}
