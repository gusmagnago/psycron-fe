import { Hero } from '@psycron/components/landing/hero/Hero';
import { SEOProvider } from '@psycron/context/seo/SEOContext';
import { ISEOProps } from '@psycron/context/seo/SEOContext.types';
import { DOMAIN } from '../urls';
import { Box, Divider } from '@mui/material';
import { C2Action } from '@psycron/components/c2action/C2Action';

import { useForm, FieldValues } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Text } from '@psycron/components/text/Text';
import {
  BenefitsBox,
  BenefitsHeading,
  BenefitsItems,
  BenefitsSectionWrapper,
  BGWrapper,
  Call2ActionFooter,
  Call2ActionFooterWrapper,
  Call2ActionInputWrapper,
  StyledBox,
  StyledText,
  ValuesImgWrapper,
  ValuesSection,
  ValuesText,
} from './index.styles';
import useViewport from '@psycron/hooks/useViewport';
import { palette } from '@psycron/theme/palette/palette.theme';

const homepageSEO: ISEOProps = {
  title: 'Psycron - Therapist management app',
  description: 'Welcome to the homepage of your site.',
  canonicalUrl: DOMAIN,
  ogTitle: 'Psycron - Therapist management app',
  ogDescription: 'Welcome to the homepage of your site.',
  ogUrl: DOMAIN,
  ogType: 'website',
};

export const Home = () => {
  const { t } = useTranslation();

  const { isMobile, isTablet, isMedium, isLarge } = useViewport();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ onSubmit ~ data:', data);
    // add correct http method
  };

  const benefits = [
    {
      key: 'increased-efficiency',
      img: '/images/img-clock.png',
      imgAlt: 'clock-icon',
      justify: 'end',
    },
    {
      key: 'better-patient-management',
      img: '/images/img-sort.png',
      imgAlt: 'sorting-box',
      justify: 'start',
    },
    {
      key: 'reduced-administrative-burden',
      img: '/images/img-hero4.png',
      imgAlt: 'img-heart-hands',
      justify: 'end',
    },
    {
      key: 'enhanced-financial-control',
      img: '/images/img-locker.png',
      imgAlt: 'locker-pig',
      justify: 'start',
    },
  ];

  return (
    <SEOProvider seo={homepageSEO}>
      <Box display='flex' justifyContent='center'>
        <Hero
          headingText={t('components.hero.heading')}
          imgSrc={'/images/img-hero2.png'}
          helperText={t('components.hero.helper')}
          c2Action={
            <C2Action
              i18nKey='components.c2-action.join-waitlist'
              label={t('components.c2-action.email')}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              bttnText={t('components.c2-action.join-now')}
            />
          }
        />
      </Box>
      <Divider />
      {/* values of the product */}
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
              <Text
                variant='h2'
                fontWeight={800}
                fontSize={'3rem'}
                isFirstUpper
              >
                {t('page.landing.values.all-in-one')}
              </Text>
            ) : null}
          </ValuesImgWrapper>
          <StyledBox>
            {isMedium || isLarge ? (
              <Text
                variant='h2'
                fontWeight={800}
                fontSize={'3rem'}
                isFirstUpper
              >
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
      <Divider />
      {/* benefits */}
      <BenefitsSectionWrapper>
        <BenefitsBox>
          {benefits.map(({ key, img, imgAlt, justify }, index) => (
            <BenefitsItems
              key={`benefits-item-${index}`}
              justify={justify}
              id='benefits'
            >
              <Box m={5}>
                <img src={img} alt={imgAlt} width={150} />
              </Box>
              <Box
                display='flex'
                flexDirection='column'
                alignItems={`flex-${justify}`}
                width='100%'
              >
                <Text
                  variant='subtitle1'
                  fontWeight={700}
                  fontSize={'1.8rem'}
                  textAlign={justify.includes('end') ? 'right' : 'left'}
                >
                  {t(`page.landing.benefits.${key}.name`)}
                </Text>
                <Text
                  variant='body2'
                  fontSize={'1rem'}
                  textAlign={justify.includes('end') ? 'right' : 'left'}
                >
                  {t(`page.landing.benefits.${key}.description`)}
                </Text>
              </Box>
            </BenefitsItems>
          ))}
        </BenefitsBox>
      </BenefitsSectionWrapper>
      <Divider />
      {/* call 2 action */}
      <BGWrapper id='join-now'>
        <Call2ActionFooterWrapper>
          <Call2ActionFooter>
            <BenefitsHeading variant='h2' isFirstUpper>
              {t('page.landing.ct-action.heading')}
            </BenefitsHeading>
            <Text variant='body2' fontSize={'1rem'} color={palette.gray['08']}>
              <Trans i18nKey={'page.landing.ct-action.join-waitlist'} />
            </Text>
          </Call2ActionFooter>
        </Call2ActionFooterWrapper>
        <Call2ActionInputWrapper>
          <C2Action
            label={t('components.c2-action.email')}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            bttnText={t('components.c2-action.join-now')}
          />
        </Call2ActionInputWrapper>
      </BGWrapper>
    </SEOProvider>
  );
};
