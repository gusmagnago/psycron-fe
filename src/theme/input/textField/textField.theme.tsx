import type { CSSObject } from '@mui/system';

const textFieldStyles = (): Record<string, CSSObject> => {
	return {
		root: {
			'& label': {
				top: '0rem',
				left: '0rem',
				transition: 'all 0.2s ease-out',
			},
			'& label.MuiInputLabel-shrink': {
				top: '-0.5rem',
				left: '-0.5rem',
			},
		},
	};
};

export default textFieldStyles;
