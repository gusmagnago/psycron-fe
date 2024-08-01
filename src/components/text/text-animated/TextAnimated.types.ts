import type { ReactNode } from 'react';

export interface ITextAnimated {
  children: (word: string) => ReactNode;
  text: string;
}
