import { palette } from '@psycron/theme/palette/palette.theme';

export type SpectrumStop = { at: number; hex: string };

export const toThickness = (stroke: number, size: number): number =>
	(stroke * 44) / size;

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

// Palette anchors: error → alert → success.
// Intermediate stops are derived via mixHex so no hex is hardcoded.
export const PROGRESS_STOPS: SpectrumStop[] = [
	{ at: 0, hex: palette.error.main },
	{ at: 0.3, hex: mixHex(palette.error.main, palette.alert.main, 0.5) },
	{ at: 0.55, hex: palette.alert.main },
	{ at: 0.8, hex: mixHex(palette.alert.main, palette.success.main, 0.6) },
	{ at: 1, hex: palette.success.main },
];

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
