import { Box } from '@mui/material';
import useViewport from '@psycron/hooks/useViewport';
import { Text } from '@psycron/components/text/Text';
import {
  StyledBox,
  StyledText,
  ValuesImgWrapper,
  ValuesSection,
  ValuesText,
} from './Values.styles';
import { useTranslation } from 'react-i18next';

export const Values = () => {
  const { t } = useTranslation();
  const { isMobile, isTablet, isMedium, isLarge } = useViewport();

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      my={5}
    >
      <ValuesSection>
        <ValuesImgWrapper>
          <img
            src='/images/img-hero3.png'
            alt='value-section1'
            style={{ transform: 'scaleX(-1)' }}
            width={250}
          />
          {isMobile || isTablet ? (
            <Text variant='h2' fontWeight={800} fontSize={'3rem'} isFirstUpper>
              {t('page.landing.values.all-in-one')}
            </Text>
          ) : null}
        </ValuesImgWrapper>
        <StyledBox>
          {isMedium || isLarge ? (
            <Text variant='h2' fontWeight={800} fontSize={'3rem'} isFirstUpper>
              {t('page.landing.values.all-in-one')}
            </Text>
          ) : null}
          <ValuesText variant='h4' textAlign='left' isFirstUpper p={5}>
            {t('page.landing.values.text')}
          </ValuesText>
        </StyledBox>
      </ValuesSection>
      <ValuesSection maxWidth={700} alignItems='center'>
        <StyledText variant='h2'>
          {t('page.landing.values.text-focus')}
        </StyledText>
        <img src='/images/img-hero5.png' alt='value-section2' width={300} />
      </ValuesSection>
    </Box>
  );
};
