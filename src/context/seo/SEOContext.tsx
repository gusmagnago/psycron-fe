import type { FC } from 'react';
import { createContext, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';

import type { ISEOContextProps, ISEOProps } from './SEOContext.types';

const SEOContext = createContext<ISEOProps | undefined>(undefined);

export const SEOProvider: FC<ISEOContextProps> = ({ seo, children }) => {
	const engDescription =
		'Revolutionize your therapy practice with a seamless all-in-one solution. With our app you can easily manage your appointments, payments, patient records, billing, and more.';

	const {
		canonicalUrl,
		description = engDescription,
		ogDescription = engDescription,
		ogImage = 'https://storage.googleapis.com/psycron-app.appspot.com/og-img.png',
		ogTitle,
		ogType,
		ogUrl,
		title,
	} = seo;

	const defaultOgImage = `${canonicalUrl}/images/og-image.png`;

	return (
		<SEOContext.Provider value={seo}>
			<Helmet>
				<title>{title}</title>
				<meta name='description' content={description} />
				<link rel='canonical' href={canonicalUrl} />

				{/* Open Graph Meta Tags */}
				{ogTitle && <meta property='og:title' content={ogTitle} />}
				{ogDescription && (
					<meta property='og:description' content={ogDescription} />
				)}
				{ogUrl && <meta property='og:url' content={ogUrl} />}
				{ogType && <meta property='og:type' content={ogType} />}
				{ogImage && (
					<meta property='og:image' content={ogImage || defaultOgImage} />
				)}
				<meta property='og:site_name' content='Psycron' />

				{/* Twitter Card Meta Tags */}
				<meta name='twitter:card' content='summary_large_image' />
				{ogTitle && <meta name='twitter:title' content={ogTitle} />}
				{ogDescription && (
					<meta name='twitter:description' content={ogDescription} />
				)}
				{ogImage && (
					<meta name='twitter:image' content={ogImage || defaultOgImage} />
				)}

				{/* Meta tags for WhatsApp */}
				<meta property='og:image:width' content='1200' />
				<meta property='og:image:height' content='630' />

				{/* Additional Meta Tags */}
				<meta name='robots' content='index, follow' />
				<meta name='author' content='Psycron' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			</Helmet>
			<Box display='flex' flexDirection='column'>
				{children}
			</Box>
		</SEOContext.Provider>
	);
};

export const useSEO = () => useContext(SEOContext);
