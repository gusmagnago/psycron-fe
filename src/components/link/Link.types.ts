import type { ReactNode } from 'react';
import type { LinkProps } from 'react-router-dom';

export interface ILinkProps extends LinkProps {
  children: ReactNode;
  firstLetterUpper?: boolean;
  isHeader?: boolean;
}

export type ILinkStyledProps = Pick<
  ILinkProps,
  'firstLetterUpper' | 'isHeader'
>;
