import type { ReactNode } from 'react';
import type { LinkProps, To } from 'react-router-dom';

export interface ILinkProps extends LinkProps {
    children: ReactNode;
    firstLetterUpper?: boolean,
    to: To;
}

export type ILinkStyledProps = Pick<ILinkProps, 'firstLetterUpper'>