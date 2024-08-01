import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BenefitsSectionWrapper = styled(Box)`
  padding: calc(2 * ${spacing.large}) 0;
  display: flex;
  justify-content: center;
  align-items: center;

  height: auto;
  width: 100%;
`;

export const BenefitsBox = styled(Box)`
  display: flex;
  width: 100%;
  margin: ${spacing.medium};
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`;
export const BGWrapper = styled(Box)`
  margin: ${spacing.medium} 0 0;
  border-radius: calc(2 * ${spacing.mediumLarge});
  background-color: ${palette.secondary.light};

  ${isBiggerThanMediumMedia} {
    margin: ${spacing.largeXl};
  }
`;

export const BenefitsHeading = styled(Text)`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: ${spacing.medium};

  ${isBiggerThanMediumMedia} {
    font-size: 2.5rem;
  }
`;
