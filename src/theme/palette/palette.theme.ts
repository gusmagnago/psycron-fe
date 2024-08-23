import type { Palette } from './palette.types';

export const palette: Palette = {
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
		main: '#E4C1F9',
		light: '#F6E7FF',
		dark: '#733499',
		access: '#23112E',
		action: {
			hover: '#C0A2D1',
			press: '#D9AAF5',
			disabled: 'rgba(198, 185, 206, 0.75)',
		},
		surface: {
			hover: '#DAC1FF',
			press: '#ECDDFF',
			light: '#FCFAFF',
			disabled: 'rgba(236, 221, 255, 0.25)',
		},
	},
	text: {
		primary: '#060B0E',
		secondary: 'rgba(6, 11, 14, 0.6)',
		disabled: 'rgba(6, 11, 14, 0.4)',
	},
	success: {
		main: '#0AFF99',
		light: '#D3FFEC',
		dark: '#004F13',
		access: '#012209',
		action: {
			hover: '#7EE4BA',
			press: '#C6F4E1',
			disabled: '#E0F8EE',
		},
		surface: {
			hover: '#BFEFCF',
			press: 'rgba(149, 193, 175)',
			light: 'rgba(146, 255, 209)',
			disabled: 'rgba(135, 173, 148)',
		},
	},
	info: {
		main: '#9C79FD',
		light: 'rgba(197, 167, 255, 0.4)',
		dark: '#433087',
		access: '#FCFAFF',
		action: {
			hover: '#8D79C3',
			press: '#DFD0F7',
			disabled: 'rgba(192, 182, 219, 0.62)',
		},
		surface: {
			hover: '#E3DDF3',
			press: '#ECDDFF',
			light: '#F4F1FD',
			disabled: '#C2B6D0',
		},
	},
	alert: {
		main: '#FBE442',
		light: '#FFF8C8',
		dark: '#494100',
		access: '#292508',
		action: {
			hover: '#E3AB3D',
			press: '#FFB966',
			disabled: '#EADBC9',
		},
		surface: {
			hover: '#FAF1B0',
			press: '#E9E0A1',
			light: '#FFFAD8',
			disabled: 'rgba(251, 228, 66, 0.3)',
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
		default: '#F7FAFA',
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
};
