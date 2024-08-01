import type { FC } from 'react';
import type { WithIconColorProps } from '@psycron/hoc/withIconColor';

export interface IAnimatedIconsProps {
  colors: (string | undefined)[];
  icons: FC<WithIconColorProps>[];
}
