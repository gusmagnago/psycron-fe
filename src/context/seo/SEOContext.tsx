import type { FC} from 'react';
import { createContext, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';

import type { ISEOContextProps, ISEOProps } from './SEOContext.types';

const SEOContext = createContext<ISEOProps | undefined>(undefined);

export const SEOProvider: FC<ISEOContextProps> = ({ seo, children }) => (
	<SEOContext.Provider value={seo}>
		<Helmet>
			<title>{seo.title}</title>
			<meta name='description' content={seo.description} />
			<link rel='canonical' href={seo.canonicalUrl} />
			{seo.ogTitle && <meta property='og:title' content={seo.ogTitle} />}
			{seo.ogDescription && (
				<meta property='og:description' content={seo.ogDescription} />
			)}
			{seo.ogUrl && <meta property='og:url' content={seo.ogUrl} />}
			{seo.ogType && <meta property='og:type' content={seo.ogType} />}
		</Helmet>
		<Box display='flex' flexDirection='column'>
			{children}
		</Box>
	</SEOContext.Provider>
);

export const useSEO = () => useContext(SEOContext);
