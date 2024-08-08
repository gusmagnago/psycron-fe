import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import type { CustomError } from '@psycron/api/error';
import { statusCodeToTranslationKey } from '@psycron/api/error';
import { waitlistSubscription } from '@psycron/api/subs';
import { C2Action } from '@psycron/components/c2action/C2Action';
import type { IWaitlistSubs } from '@psycron/components/c2action/C2Action.types';
import { Benefits } from '@psycron/components/landing/benefits/Benefits';
import { Call2ActionSection } from '@psycron/components/landing/call-to-action/Call2Action';
import { Hero } from '@psycron/components/landing/hero/Hero';
import { Values } from '@psycron/components/landing/values/Values';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { SEOProvider } from '@psycron/context/seo/SEOContext';
import { useMutation } from '@tanstack/react-query';

import { DOMAIN } from '../urls';

export const Home = () => {
	const { t } = useTranslation();

	const { locale } = useParams<{ locale: string }>();

	const [heroError, setHeroError] = useState<string | null>(null);
	const [footerError, setFooterError] = useState<string | null>(null);

	const { showAlert } = useAlert();

	const heroMutation = useMutation({
		mutationFn: waitlistSubscription,
		onSuccess: () => {
			setHeroError(null);
			showAlert({
				message: t('globals.success.subscribed'),
				severity: 'success',
			});
		},
		onError: (error: CustomError) => {
			const translationKey = statusCodeToTranslationKey[error.statusCode];

			setHeroError(t(translationKey));
			showAlert({
				message: t(translationKey),
				severity: 'warning',
				resetCallback: () => heroMutation.reset(),
			});
		},
	});

	const footerMutation = useMutation({
		mutationFn: waitlistSubscription,
		onSuccess: () => {
			setFooterError(null);
			showAlert({
				message: t('globals.success.subscribed'),
				severity: 'success',
			});
		},
		onError: (error: CustomError) => {
			const translationKey = statusCodeToTranslationKey[error.statusCode];
			setFooterError(translationKey);
			showAlert({
				message: t(translationKey),
				severity: 'warning',
				resetCallback: () => footerMutation.reset(),
			});
		},
	});

	const onHeroSubmit = (data: IWaitlistSubs) => {
		const submissionData = {
			email: data.email.toLowerCase(),
			language: locale,
		};
		heroMutation.mutate(submissionData);
	};

	const onFooterSubmit = (data: IWaitlistSubs) => {
		const submissionData = {
			email: data.email.toLowerCase(),
			language: locale,
		};
		footerMutation.mutate(submissionData);
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
							onSubmit={onHeroSubmit}
							bttnText={t('components.c2-action.join-now')}
							error={heroError}
							isLoading={heroMutation.isPending}
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
								onSubmit={onFooterSubmit}
								bttnText={t('components.c2-action.join-now')}
								error={footerError}
								isLoading={footerMutation.isPending}
							/>
						}
					/>
				</Box>
			</Box>
		</SEOProvider>
	);
};
