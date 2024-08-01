import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { useTranslation } from 'react-i18next';
import { Brand } from '@psycron/components/icons';
import { Link } from '@psycron/components/link/Link';
import { scrollToSection } from '@psycron/utils/variables';
import { Localization } from '@psycron/components/localization/Localization';
import { HeaderWrapper } from './Header.styles';
import useViewport from '@psycron/hooks/useViewport';

export const Header = () => {
  const { t } = useTranslation();

  const { isMobile } = useViewport();

  return (
    <HeaderWrapper>
      <Box height={'50px'} width={'150px'}>
        <Brand />
      </Box>
      <Box display='flex' alignItems='center'>
        {!isMobile ? (
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
