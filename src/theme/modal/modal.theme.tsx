import type { CSSObject } from '@mui/system';

const modalStyles = (): Record<string, CSSObject> => {
	return {
		root: {
			backdropFilter: 'blur(2px)',
			WebkitBackdropFilter: 'blur(2px)',
			backgroundColor: 'rgba(255, 255, 255, 0.25)',
		},
	};
};

export default modalStyles;
