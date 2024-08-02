import { useParams } from 'react-router-dom';

import { StyledAnchor, StyledLink } from './Link.styles';
import type { ILinkProps } from './Link.types';

export const Link = ({
	children,
	to,
	firstLetterUpper,
	isHeader,
	...props
}: ILinkProps) => {
	const { lang } = useParams<{ lang: string }>();

	const isString = (value: unknown): value is string =>
		typeof value === 'string';

	const isExternal = isString(to) && /^https?:\/\//.test(to);

	if (isExternal) {
		return (
			<StyledAnchor href={to} target='_blank' rel='noreferrer' {...props}>
				{children}
			</StyledAnchor>
		);
	}

	const prefixedTo = isString(to)
		? `/${lang}${to}`
		: { ...to, pathname: `/${lang}${to.pathname}` };

	return (
		<StyledLink
			to={prefixedTo}
			firstLetterUpper={firstLetterUpper}
			isHeader={isHeader}
			{...props}
		>
			{children}
		</StyledLink>
	);
};
