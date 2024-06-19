import { palette } from '@psycron/theme/palette/palette.theme';

import { StyledLink } from './Link.styles';
import type { ILinkProps } from './Link.types';

export const Link = ({ children, to }: ILinkProps) => {
	return (
		<StyledLink to={to} color={palette.secondary.main}>
			{children}
		</StyledLink>
	);
};
