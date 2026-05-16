export type SpectrumStop = { at: number; hex: string };

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const hexToRgb = (hex: string): { b: number; g: number; r: number } => {
	const normalized = hex.replace('#', '');
	const value = Number.parseInt(normalized, 16);

	return {
		b: value & 255,
		g: (value >> 8) & 255,
		r: (value >> 16) & 255,
	};
};

const rgbToHex = (r: number, g: number, b: number): string => {
	const toHex = (value: number): string =>
		Math.round(Math.max(0, Math.min(255, value)))
			.toString(16)
			.padStart(2, '0');

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const mixHex = (from: string, to: string, ratio: number): string => {
	const a = hexToRgb(from);
	const b = hexToRgb(to);

	return rgbToHex(
		a.r + (b.r - a.r) * ratio,
		a.g + (b.g - a.g) * ratio,
		a.b + (b.b - a.b) * ratio
	);
};

export const sampleStops = (stops: SpectrumStop[], ratio: number): string => {
	const value = clamp01(ratio);

	for (let index = 0; index < stops.length - 1; index += 1) {
		const start = stops[index];
		const end = stops[index + 1];

		if (value >= start.at && value <= end.at) {
			const localRatio = (value - start.at) / (end.at - start.at);
			return mixHex(start.hex, end.hex, localRatio);
		}
	}

	return stops[stops.length - 1].hex;
};

export const PROGRESS_STOPS: SpectrumStop[] = [
	{ at: 0, hex: '#ff5450' },
	{ at: 0.34, hex: '#ff8a4c' },
	{ at: 0.67, hex: '#f59e0b' },
	{ at: 0.9, hex: '#a3e635' },
	{ at: 1, hex: '#00c777' },
];

export interface ProgressGradient {
	endColor: string;
	glow: string;
	startColor: string;
}

export const progressGradient = (percentage: number): ProgressGradient => {
	const ratio = clamp01(percentage / 100);
	const startColor = sampleStops(PROGRESS_STOPS, Math.max(0, ratio - 0.18));
	const endColor = sampleStops(PROGRESS_STOPS, ratio);

	return { endColor, glow: endColor, startColor };
};
