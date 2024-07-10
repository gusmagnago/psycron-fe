import { Grid, styled } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const TabledHeadRowItem = styled(Grid)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;

  &:hover {
    cursor: pointer;
  }
`;

export const StyledTableHeadGrid = styled(Grid)`
  flex-wrap: nowrap;

  padding: ${spacing.xs};
  ${isBiggerThanTabletMedia} {
    padding-right: ${spacing.small};
  }
`;
