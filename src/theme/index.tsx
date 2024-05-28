import { createTheme } from '@mui/material';

import alertStyles from './alert/alert.theme';
import buttonStyles from './button/button.theme';
import linkStyles from './button/link/link.theme';
import checkboxStyles from './checkbox/checkbox.theme';
import dividerStyles from './divider/divider.theme';
import inputStyles from './input/input.theme';
import labelStyles from './input/label/label.theme';
import inputOutlinedStyles from './input/outlined/inputOutlined.theme';
import paginationItemStyles from './pagination/pagination.theme';
import { palette } from './palette/palette.theme';
import paperStyles from './paper/paper.theme';
import progressBarStyles from './progress-bar/progressBar.theme';
import radioStyles from './radio/radio.theme';
import menuItemStyles from './select/menu-item/menuItem.theme';
import selectStyles from './select/select.theme';
import switchStyles from './swtich/switch.theme';
import tooltipeStyles from './tooltip/tooltip.theme';

const theme = createTheme({
	palette: palette,
	typography: {
		fontFamily: 'Inter, sans-serif',
	},
	components: {
		MuiButton: {
			styleOverrides: buttonStyles(createTheme({ palette })),
		},
		MuiLink: {
			styleOverrides: linkStyles(createTheme({ palette })),
		},
		MuiCheckbox: {
			styleOverrides: checkboxStyles(createTheme({ palette })),
		},
		MuiSwitch: {
			styleOverrides: switchStyles(createTheme({ palette })),
		},
		MuiRadio: {
			styleOverrides: radioStyles(createTheme({ palette })),
		},
		MuiDivider: {
			styleOverrides: dividerStyles(createTheme({ palette })),
		},
		MuiTooltip: {
			styleOverrides: tooltipeStyles(createTheme({ palette })),
		},
		MuiLinearProgress: {
			styleOverrides: progressBarStyles(),
		},
		MuiAlert: {
			styleOverrides: alertStyles(createTheme({ palette })),
		},
		MuiInputBase: {
			styleOverrides: inputStyles(createTheme({ palette })),
		},
		MuiOutlinedInput: {
			styleOverrides: inputOutlinedStyles(createTheme({ palette })),
		},
		MuiInputLabel: {
			styleOverrides: labelStyles(createTheme({ palette })),
		},
		MuiSelect: {
			styleOverrides: selectStyles(createTheme({ palette })),
		},
		MuiMenuItem: {
			styleOverrides: menuItemStyles(createTheme({ palette })),
		},
		MuiPaper: {
			styleOverrides: paperStyles(createTheme({ palette })),
		},
		MuiPaginationItem: {
			styleOverrides: paginationItemStyles(createTheme({ palette })),
		},
	},
});

export default theme;
