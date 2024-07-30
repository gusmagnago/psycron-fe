import { ReactNode } from 'react';

export interface ISEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: string;
}

export interface ISEOContextProps {
  seo: ISEOProps;
  children: ReactNode;
}
