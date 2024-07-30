import { styled, Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
  isBiggerThanMediumMedia,
  isBiggerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const HeroWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;

  margin-bottom: ${spacing.largeXl};

  ${isBiggerThanMediumMedia} {
    height: 43.75rem;
  }
`;

export const Heading = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: column;

  ${isBiggerThanTabletMedia} {
    flex-direction: row;
  }
`;

export const Image = styled('img')`
  width: 15.625rem;
`;

export const H2 = styled(Text)`
  font-size: 2.3rem;
  text-align: center;
  padding-bottom: ${spacing.mediumLarge};
  font-weight: 800;
  max-width: 50rem;

  ${isBiggerThanTabletMedia} {
    font-size: 3rem;
    text-align: left;
    padding-bottom: 0;
  }
`;

export const H6 = styled(Text)`
  font-weight: 500;
  font-size: 1rem;
  text-align: center;

  ${isBiggerThanTabletMedia} {
    font-size: 1.2rem;
  }
`;
