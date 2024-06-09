import type { CSSObject } from '@mui/system';

import { shadowMain } from '../shadow/shadow.theme';

const avatarStyles = (): Record<string, CSSObject> => {
	return {
		root: {
			boxShadow: shadowMain,
		},
		img: {
			objectFit: 'contain'

		}
	};
};

export default avatarStyles;
