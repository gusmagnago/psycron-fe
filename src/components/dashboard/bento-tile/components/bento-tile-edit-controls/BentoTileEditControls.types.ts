export interface BentoTileEditControlLabels {
	drag: string;
	dragAria: string;
	hide: string;
	layoutColumn: string;
	layoutColumnAria: string;
	layoutRow: string;
	layoutRowAria: string;
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
	onOrientationToggle?: () => void;
	onResizeDown?: () => void;
	onResizeUp?: () => void;
	orientation?: 'column' | 'row';
}
