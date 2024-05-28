import { switchClasses } from '@mui/material';
import type { CSSObject, Theme } from '@mui/material/styles';

import type { Palette } from '../palette/palette.types';
import { shadowDisabled } from '../shadow/shadow.theme';


const switchStyles = ({palette}: Theme): Record<string, CSSObject>  => {
	const {
		error, success
	} = palette as unknown as Palette;

	return {
		switchBase: {
			color: error.main, 
			'&:hover': {
				backgroundColor: error.main,
				color: error.action.hover
			},
			'&:focus': {
				backgroundColor: error.action.hover,
				color: error.main
			},
			'&:disabled': {
				color: error.action.disabled
			},
			[`&.${switchClasses.checked}`]: {
				color: success.main,
				'&:hover': {
					backgroundColor: success.main,
					color: success.action.hover,
				},
				'&:focus': {
					backgroundColor: success.action.hover,
					color: success.main
				},
				'&:disabled': {
					color: success.action.disabled,
				},
			}
		},
		track: {
			opacity: 0.5,
			backgroundColor: error.main,
			boxShadow: shadowDisabled,
			'.Mui-checked.Mui-checked + &': {
				opacity: 0.5,
				backgroundColor: success.main,
			}
		}

	}
    
};

export default switchStyles;
