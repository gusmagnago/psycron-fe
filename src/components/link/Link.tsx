import { StyledLink } from './Link.styles';
import type { ILinkProps } from './Link.types';

export const Link = ({ children, to, firstLetterUpper }: ILinkProps) => {
	return (
		<StyledLink to={to} firstLetterUpper={firstLetterUpper}>
			{children}
		</StyledLink>
	);
};
