import { useParams } from 'react-router-dom';
import { StyledLink } from './Link.styles';
import type { ILinkProps } from './Link.types';

export const Link = ({
  children,
  to,
  firstLetterUpper,
  ...props
}: ILinkProps) => {
  const { lang } = useParams<{ lang: string }>();

  const prefixedTo = `/${lang}${to}`;
  return (
    <StyledLink to={prefixedTo} firstLetterUpper={firstLetterUpper} {...props}>
      {children}
    </StyledLink>
  );
};
