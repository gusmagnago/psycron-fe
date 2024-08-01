import { FC } from 'react';
import { WithIconColorProps } from '@psycron/hoc/withIconColor';

export interface IAnimatedIconsProps {
  icons: FC<WithIconColorProps>[];
  colors: (string | undefined)[];
}
