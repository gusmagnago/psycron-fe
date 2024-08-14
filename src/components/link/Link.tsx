import type { To } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { HOMEPAGE } from '@psycron/pages/urls';
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
	const navigate = useNavigate();

	const isString = (value: To): value is string => typeof value === 'string';

	const isExternal =
		isString(to) && (/^https?:\/\//.test(to) || /^mailto:/.test(to));

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const label = isString(to) ? to : to.pathname;
		trackLinkClick(label);

		if (to === 'go-back') {
			e.preventDefault();

			const referrer = document.referrer;
			const isInternalReferrer = referrer.includes(window.location.origin);

			if (isInternalReferrer) {
				navigate(-1);
			} else {
				navigate(HOMEPAGE);
			}
		}
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
