import type { AppPalette } from './palette.types';

export const palette: AppPalette = {
	primary: {
		main: '#A9DEF9',
		light: '#EEF4F8',
		dark: '#1B3D4C',
		access: '#F1F7FB',
		action: {
			hover: '#7BA8BE',
			press: '#ADD4E8',
			disabled: '#C4D6DF',
		},
		surface: {
			hover: '#C3D1DA',
			press: '#7BA8BE',
			light: '#E6F6FF',
			disabled: 'rgba(223, 231, 236, 0.6)',
		},
	},
	secondary: {
		main: '#FF99C8',
		light: '#FFDFEE',
		dark: '#4D0727',
		access: '#66012F',
		action: {
			hover: '#DF85AE',
			press: '#FF79B7',
			disabled: 'rgba(223, 133, 174, 0.5)',
		},
		surface: {
			light: '#FFEFF7',
			disabled: 'rgba(226, 209, 217, 0.75)',
		},
	},
	tertiary: {
		main: '#BFA7FF',
		light: '#EFEAFF',
		dark: '#4A2DB8',
		access: '#1B1233',
		action: {
			hover: '#AB8FFF',
			press: '#9A7BFF',
			disabled: 'rgba(182, 171, 206, 0.75)',
		},
		surface: {
			hover: '#DED4FF',
			press: '#F0EBFF',
			light: '#FCFBFF',
			disabled: 'rgba(240, 235, 255, 0.32)',
		},
	},
	text: {
		primary: '#060B0E',
		secondary: 'rgba(6, 11, 14, 0.6)',
		disabled: 'rgba(6, 11, 14, 0.4)',
	},
	success: {
		main: '#00C777',
		light: '#DFFFEF',
		dark: '#007A4A',
		access: '#052317',
		action: {
			hover: '#00B96F',
			press: '#009D60',
			disabled: 'rgba(0, 199, 119, 0.35)',
		},
		surface: {
			hover: 'rgba(0, 199, 119, 0.12)',
			press: 'rgba(0, 199, 119, 0.18)',
			light: 'rgba(0, 199, 119, 0.08)',
			disabled: 'rgba(0, 199, 119, 0.05)',
		},
	},
	info: {
		main: '#4F73FF',
		light: 'rgba(142, 174, 255, 0.30)',
		dark: '#2140B8',
		access: '#FCFAFF',
		action: {
			hover: '#3F63E8',
			press: '#D3DDFF',
			disabled: 'rgba(176, 192, 232, 0.62)',
		},
		surface: {
			hover: '#E3E9FF',
			press: '#EFF3FF',
			light: '#F6F8FF',
			disabled: '#C2CDEA',
		},
	},
	alert: {
		main: '#E8853D',
		light: '#FFF0E5',
		dark: '#6B2E0A',
		access: '#3D1A06',
		action: {
			hover: '#D4762F',
			press: '#C06825',
			disabled: '#E6D5C7',
		},
		surface: {
			hover: '#FFE4CC',
			press: '#FFD4B0',
			light: '#FFF5ED',
			disabled: 'rgba(232, 133, 61, 0.3)',
		},
	},
	error: {
		main: '#FF5450',
		light: '#FFBBB0',
		dark: '#570D0E',
		access: '#FFE9E5',
		action: {
			hover: '#E56058',
			press: 'rgba(255, 146, 134, 0.5)',
			disabled: '#E6C7C7',
		},
		surface: {
			hover: '#FAD1D0',
			press: '#F4B1B0',
			light: '#FFEFEE',
			disabled: '#EED2D2',
		},
	},
	background: {
		default: '#f7fafa',
		paper: '#F1F7FB',
	},
	black: '#060B0E',
	border: '#',
	gray: {
		'01': '#F3F4F4',
		'02': '#DBDDDE',
		'03': '#C4C7C9',
		'04': '#ADB1B3',
		'05': '#979C9E',
		'06': '#82878A',
		'07': '#6E7375',
		'08': '#5A5F61',
		'09': '#484C4E',
		dark: '#363A3B',
	},
	brand: {
		dark: '#4a2db8',
		google: '#3B82F6',
		light: '#f0ebff',
		purple: '#683fff',
	},
	// warning mirrors alert — MUI expects a `warning` palette key for the severity system
	warning: {
		main: '#E8853D',
		light: '#FFF0E5',
		dark: '#6B2E0A',
		access: '#3D1A06',
		action: {
			hover: '#D4762F',
			press: '#C06825',
			disabled: '#E6D5C7',
		},
		surface: {
			hover: '#FFE4CC',
			press: '#FFD4B0',
			light: '#FFF5ED',
			disabled: 'rgba(232, 133, 61, 0.3)',
		},
	},
	white: '#FFFFFF',
};

export const hexToRgba = (hex: string, alpha: number): string => {
	const normalized = hex.replace('#', '');
	const full =
		normalized.length === 3
			? normalized
					.split('')
					.map((c) => c + c)
					.join('')
			: normalized;

	if (full.length !== 6) {
		throw new Error('Invalid hex color');
	}

	const r = Number.parseInt(full.slice(0, 2), 16);
	const g = Number.parseInt(full.slice(2, 4), 16);
	const b = Number.parseInt(full.slice(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
