import type { ReactNode } from 'react'

import type { CardActionsProps } from './CardActions/CardActions.types';
import type { CardTitleProps } from './CardTitle/CardTitle.types';

export type CardTypes = {
    cardTitle: boolean;
    content: ReactNode;
}

export interface CardProps extends CardTypes {
  cardActionsProps: CardActionsProps;
  cardTitleProps: CardTitleProps;
}