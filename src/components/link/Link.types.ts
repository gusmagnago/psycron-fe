import type { ReactNode } from 'react';
import type { LinkProps, To } from 'react-router-dom';

export interface ILinkProps extends LinkProps {
    children: ReactNode
    to: To
}