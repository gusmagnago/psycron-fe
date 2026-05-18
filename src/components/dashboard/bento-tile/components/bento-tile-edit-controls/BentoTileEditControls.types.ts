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
	resizeNarrow: string;
	resizeNarrowAria: string;
	resizeUp: string;
	resizeUpAria: string;
	resizeWide: string;
	resizeWideAria: string;
	show: string;
}

export interface BentoTileEditControlsProps {
	isHidden?: boolean;
	labels: BentoTileEditControlLabels;
	onHideToggle?: () => void;
	onOrientationToggle?: () => void;
	onResizeDown?: () => void;
	onResizeNarrow?: () => void;
	onResizeUp?: () => void;
	onResizeWide?: () => void;
	orientation?: 'column' | 'row';
}
