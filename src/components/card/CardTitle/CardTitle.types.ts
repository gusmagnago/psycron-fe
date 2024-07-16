import { ReactElement } from 'react';

export type CardTitleProps = {
  firstChip?: () => void;
  firstChipName?: string | ReactElement<any, any>;
  firstChipTooltip?: string;
  hasFirstChip?: boolean;
  hasSecondChip?: boolean;
  secondChip?: () => void;
  secondChipName?: string;
  subheader?: string;
  title: string;
};
