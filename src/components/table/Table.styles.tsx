import { Box, Paper, styled } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const TableWrapper = styled(Box)`
  padding: ${spacing.small};
  ${isBiggerThanTabletMedia} {
    padding: ${spacing.mediumSmall};
  }
`;

export const StyledPaper = styled(Paper)`
  width: 100%;
  padding: ${spacing.space};
  border-radius: calc(2 * ${spacing.mediumSmall});

  ${isBiggerThanTabletMedia} {
    padding: ${spacing.medium};
  }
`;
