import type { To } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { trackLinkClick } from '@psycron/utils/variables/GA4';

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

	const isString = (value: To): value is string => typeof value === 'string';

	const isExternal = isString(to) && /^https?:\/\//.test(to);

	const handleClick = () => {
		const label = isString(to) ? to : to.pathname;
		trackLinkClick(label);
	};

	if (isExternal) {
		return (
			<StyledAnchor
				href={to}
				target='_blank'
				rel='noreferrer'
				firstLetterUpper={firstLetterUpper}
				isHeader={isHeader}
				onClick={handleClick}
				{...props}
			>
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
			onClick={handleClick}
			{...props}
		>
			{children}
		</StyledLink>
	);
};
