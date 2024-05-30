import type { ReactNode } from 'react'

import type { CardActionsProps } from './card-actions/CardActions.types';
import type { CardTitleProps } from './card-title/CardTitle.types';

export type CardTypes = {
    cardTitle: boolean;
    content: ReactNode;
}

export interface CardProps extends CardTypes {
  cardActionsProps: CardActionsProps;
  cardTitleProps: CardTitleProps;
}