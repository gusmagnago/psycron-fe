import { hexToRgba, palette } from '../palette/palette.theme';

export const jupiterBackgroundMain = `linear-gradient(
		90deg,
		${hexToRgba(palette.secondary.main, 0.2)} 0%,
		${hexToRgba(palette.primary.main, 0.4)} 100%
	);
`;

export const jupiterBackgroundSoft = `linear-gradient(
	135deg,
	${hexToRgba(palette.brand.purple, 0.05)} 0%,
	${hexToRgba(palette.brand.purple, 0.1)} 100%
)`;
