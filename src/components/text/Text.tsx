import type { FC } from 'react';

import { StyledTypography } from './Text.styles';
import type { ITextProps } from './Text.types';


export const Text: FC<ITextProps> = ({ children, isFirstUpper, ...rest }) => {
	console.log('🚀 ~ isFirstUpper:', isFirstUpper)
	return (
		<StyledTypography isFirstUpper={isFirstUpper} {...rest}>
			{children}
		</StyledTypography>
	);
};
