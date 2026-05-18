import { hexToRgba, palette } from './palette.theme';

export type DashboardAccentTone =
	| 'brand'
	| 'danger'
	| 'info'
	| 'neutral'
	| 'success'
	| 'today'
	| 'warning';

export interface DashboardAccent {
	border: string;
	contrast: string;
	main: string;
	surface: string;
}

export const dashboardAccents: Record<DashboardAccentTone, DashboardAccent> = {
	brand: {
		border: hexToRgba(palette.brand.purple, 0.2),
		contrast: palette.brand.dark,
		main: palette.brand.purple,
		surface: palette.brand.light,
	},
	danger: {
		border: hexToRgba(palette.error.main, 0.2),
		contrast: palette.error.dark,
		main: palette.error.main,
		surface: palette.error.surface.light,
	},
	info: {
		border: hexToRgba(palette.primary.main, 0.38),
		contrast: palette.primary.dark,
		main: palette.primary.main,
		surface: palette.primary.surface.light,
	},
	neutral: {
		border: palette.gray['02'],
		contrast: palette.gray['07'],
		main: palette.gray['05'],
		surface: palette.gray['01'],
	},
	success: {
		border: hexToRgba(palette.success.main, 0.18),
		contrast: palette.success.dark,
		main: palette.success.main,
		surface: palette.success.surface.light,
	},
	today: {
		border: hexToRgba(palette.secondary.main, 0.35),
		contrast: palette.secondary.dark,
		main: palette.secondary.main,
		surface: palette.secondary.surface.light,
	},
	warning: {
		border: hexToRgba(palette.alert.main, 0.22),
		contrast: palette.alert.dark,
		main: palette.alert.main,
		surface: palette.alert.surface.light,
	},
};

export const dashboardGradients = {
	jupiter: `linear-gradient(135deg, ${palette.brand.purple} 0%, ${palette.tertiary.main} 48%, ${palette.secondary.main} 100%)`,
} as const;
