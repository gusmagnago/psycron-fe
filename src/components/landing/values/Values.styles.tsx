import { Box, styled } from '@mui/material';

import { Text } from '@psycron/components/text/Text';
import {
  isBiggerThanTabletMedia,
  isBiggerThanMediumMedia,
  isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';

import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ValuesSection = styled(Box)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: auto;

  ${isBiggerThanMediumMedia} {
    flex-direction: row;
    height: 43.75rem;
  }
`;

export const ValuesImgWrapper = styled(Box)`
  padding: 0 ${spacing.mediumLarge};

  display: flex;
  align-items: center;
  flex-direction: row;

  ${isMobileMedia} {
    flex-direction: column;
  }
`;

export const StyledBox = styled(Box)`
  display: flex;
  justify-content: center;

  flex-direction: column;
  margin-right: 0;
  margin-bottom: ${spacing.large};

  ${isBiggerThanTabletMedia} {
    margin-right: ${spacing.large};
    margin-bottom: 0;
  }
`;

export const StyledText = styled(Text)`
  font-size: 2rem;
  font-weight: 800;
  margin-right: 0;
  margin-bottom: ${spacing.large};

  ${isBiggerThanTabletMedia} {
    font-size: 2.5rem;
    margin-right: ${spacing.large};
    margin-bottom: 0;
  }
`;

export const ValuesText = styled(Text)`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: ${spacing.large};

  ${isBiggerThanTabletMedia} {
    font-size: 2rem;
    font-weight: 600;
  }
`;
