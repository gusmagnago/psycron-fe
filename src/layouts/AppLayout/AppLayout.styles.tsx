import { Box, styled } from '@mui/material';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const Content = styled(Box)`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${spacing.medium} ${spacing.small} 0;

  margin-top: ${spacing.medium};
  ${isBiggerThanMediumMedia} {
    margin-top: 0;
  }
`;

export const LayoutWraper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  justify-content: flex-start;
  padding: ${spacing.medium} ${spacing.small};

  ${isBiggerThanMediumMedia} {
    flex-direction: row;
  }
`;
