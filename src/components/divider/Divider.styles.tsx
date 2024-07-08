import { Divider, styled } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';

export const SmallDivider = styled(Divider)`
  border-width: 2px;

  ${isBiggerThanTabletMedia} {
    border-width: 4px;
  }
`;
