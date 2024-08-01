import { ReactNode } from 'react';

export interface ITextAnimated {
  text: string;
  children: (word: string) => ReactNode;
}
