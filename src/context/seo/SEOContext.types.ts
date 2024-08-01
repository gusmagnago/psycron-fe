import type { ReactNode } from 'react';

export interface ISEOProps {
  canonicalUrl: string;
  description: string;
  ogDescription?: string;
  ogTitle?: string;
  ogType?: string;
  ogUrl?: string;
  title: string;
}

export interface ISEOContextProps {
  children: ReactNode;
  seo: ISEOProps;
}
