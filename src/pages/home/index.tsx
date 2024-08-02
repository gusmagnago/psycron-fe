import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Divider } from '@mui/material';
import { C2Action } from '@psycron/components/c2action/C2Action';
import { Benefits } from '@psycron/components/landing/benefits/Benefits';
import { Call2ActionSection } from '@psycron/components/landing/call-to-action/Call2Action';
import { Hero } from '@psycron/components/landing/hero/Hero';
import { Values } from '@psycron/components/landing/values/Values';
import { SEOProvider } from '@psycron/context/seo/SEOContext';
import type { ISEOProps } from '@psycron/context/seo/SEOContext.types';

import { DOMAIN } from '../urls';

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
	};

	return (
		<SEOProvider seo={homepageSEO}>
			<Box zIndex={10}>
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
				<Divider />
				<Values />
				<Divider />
				<Benefits />
				<Divider />
				<Box p={10} display='flex' justifyContent='center'>
					<Call2ActionSection
						headingText={t('page.landing.ct-action.heading')}
						i18nextTrans={'page.landing.ct-action.join-waitlist'}
						c2Action={
							<C2Action
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
			</Box>
		</SEOProvider>
	);
};
