import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover } from '@psycron/theme/zIndex';

export const bentoTileTheme = {
	backdrop: {
		blur: spacing.mediumSmall,
		saturation: '140%',
	},
	border: {
		control: spacing.none,
		focus: `calc(${spacing.xxs} / 2)`,
		tileEdit: `calc(${spacing.xxs} / 2)`,
	},
	color: {
		control: palette.gray['05'],
		controlHover: palette.tertiary.main,
		darkBackground: hexToRgba(palette.black, 0.45),
		darkBorder: hexToRgba(palette.white, 0.08),
	},
	elevation: {
		chrome: zIndexHover,
		overlay: zIndexHover,
	},
	footer: {
		minHeight: `calc(${spacing.xs} + calc(${spacing.xxs} / 2))`,
	},
	jupiter: {
		secondaryStop: hexToRgba(palette.secondary.main, 0.25),
		tertiaryStop: hexToRgba(palette.tertiary.main, 0.35),
	},
	motion: {
		colorTransition: 'color 0.15s ease',
		tileTransition: 'box-shadow 0.2s ease, border-color 0.2s ease',
	},
	opacity: {
		hidden: 0.4,
	},
	radius: {
		control: spacing.xxs,
		dropTarget: spacing.mediumSmall,
		tile: spacing.medium,
	},
	size: {
		dragHandleFont: `calc(${spacing.small} + calc(${spacing.xxs} / 2))`,
		headerTitleFont: `calc(${spacing.xs} + ${spacing.xs})`,
		modalMaxHeight: 'min(76vh, 42rem)',
		modalMaxWidth: 'min(92vw, 42rem)',
	},
	space: {
		controlInset: `calc(${spacing.xxs} / 2)`,
		controlPairGap: `calc(${spacing.xxs} / 2)`,
	},
};
