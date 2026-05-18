import type { CSSProperties } from 'react';

export interface DonutProgressGlassProps {
	disableParallax?: boolean;
	label?: string;
	meta?: string;
	size?: number;
	stroke?: number;
	value: number;
}

export interface DonutFrameStyle extends CSSProperties {
	'--donut-label-font': string;
	'--donut-meta-font': string;
	'--donut-progress-color': string;
}
