import { createContext, FC, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { ISEOContextProps, ISEOProps } from './SEOContext.types';
import { Box } from '@mui/material';

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
