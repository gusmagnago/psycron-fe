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

import { DOMAIN } from '../urls';

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

	const homepageSEO = {
		title: t('page.landing.seo.title'),
		description: t('page.landing.seo.description'),
		canonicalUrl: window.location.href || DOMAIN,
		ogTitle: t('page.landing.seo.ogTitle'),
		ogDescription: t('page.landing.seo.ogDescription'),
		ogUrl: window.location.href || DOMAIN,
		ogType: 'website',
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
