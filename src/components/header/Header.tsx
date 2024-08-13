import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Brand } from '@psycron/components/icons';
import { Link } from '@psycron/components/link/Link';
import { Localization } from '@psycron/components/localization/Localization';
import { Text } from '@psycron/components/text/Text';
import useViewport from '@psycron/hooks/useViewport';
import { scrollToSection } from '@psycron/utils/variables';

import { HeaderWrapper } from './Header.styles';

export const Header = () => {
	const { t } = useTranslation();

	const location = useLocation();

	const hideLinks = location.pathname.includes('unsubscribe');
	const { isMobile } = useViewport();

	return (
		<HeaderWrapper>
			<Box height={'50px'} width={'150px'}>
				<Brand />
			</Box>
			<Box display='flex' alignItems='center'>
				{!hideLinks && !isMobile ? (
					<>
						<Text isFirstUpper>
							<Link to='#' isHeader onClick={() => scrollToSection('benefits')}>
								{t('components.header.benefits')}
							</Link>
						</Text>
						<Text isFirstUpper>
							<Link to='#' isHeader onClick={() => scrollToSection('join-now')}>
								{t('components.header.join')}
							</Link>
						</Text>
					</>
				) : null}
				<Localization />
			</Box>
		</HeaderWrapper>
	);
};
