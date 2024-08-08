import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { ChevronLeft } from '@psycron/components/icons/chevron/ChevronLeft';
import { ChevronRight } from '@psycron/components/icons/chevron/ChevronRight';
import { HOMEPAGE } from '@psycron/pages/urls';

import { Link } from '../Link';

import type { INavigateLinkProps } from './NavigateLink.types';

export const NavigateLink = ({ isBack, nextPage }: INavigateLinkProps) => {
	const { t } = useTranslation();

	const linkTarget = isBack ? 'go-back' : nextPage || HOMEPAGE;

	return (
		<Box display='flex' alignItems='center'>
			<Link to={linkTarget} isHeader>
				{isBack ? <ChevronLeft /> : null}
				{isBack
					? t('components.link.navigate.back')
					: t('components.link.navigate.next')}
				{!isBack ? <ChevronRight /> : null}
			</Link>
		</Box>
	);
};
