import { Hero } from '@psycron/components/landing/hero/Hero';
import { SEOProvider } from '@psycron/context/seo/SEOContext';
import { ISEOProps } from '@psycron/context/seo/SEOContext.types';
import { DOMAIN } from '../urls';
import { Box, Divider } from '@mui/material';
import { C2Action } from '@psycron/components/c2action/C2Action';

import { useForm, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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

  return (
    <SEOProvider seo={homepageSEO}>
      <Box display='flex' justifyContent='center'>
        <Hero
          headingText={
            'Revolutionize your therapy practice with a seamless all-in-one solution'
          }
          imgSrc={'/images/img-hero2.png'}
          helperText={
            'Easily manage your appointments, payments, patient records, billing, and more.'
          }
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
    </SEOProvider>
  );
};
