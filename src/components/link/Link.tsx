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
	const { locale } = useParams<{ locale: string }>();
	const navigate = useNavigate();

	const isString = (value: To): value is string => typeof value === 'string';

	const isExternal =
		isString(to) && (/^https?:\/\//.test(to) || /^mailto:/.test(to));

	const isHashLink = isString(to) && to.startsWith('#');

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (isHashLink) {
			e.preventDefault();
			const targetElement = document.getElementById(to.slice(1));
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth' });
			}
			return;
		}

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

	const prefixedTo = isString(to) ? `/${locale}/${to}` : '#';

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
