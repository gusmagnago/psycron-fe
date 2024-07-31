import { Box, styled } from '@mui/material';

import { Text } from '@psycron/components/text/Text';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';

import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BenefitsBox = styled(Box)`
  width: 100%;

  ${isBiggerThanTabletMedia} {
    width: 50%;
  }
`;
export const BGWrapper = styled(Box)`
  margin: ${spacing.medium} 0 0;
  border-radius: calc(2 * ${spacing.mediumLarge});
  background-color: ${palette.secondary.light};

  ${isBiggerThanTabletMedia} {
    margin: ${spacing.largeXl};
  }
`;

export const BenefitsSectionWrapper = styled(Box)`
  padding: calc(2 * ${spacing.large}) 0;
  display: flex;
  justify-content: center;
`;

export const BenefitsHeading = styled(Text)`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: ${spacing.medium};

  ${isBiggerThanTabletMedia} {
    font-size: 2.5rem;
  }
`;
export const BenefitsItems = styled(Box, {
  shouldForwardProp: (props) => props !== 'justify',
})<{ justify: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: ${spacing.mediumLarge};

  ${isBiggerThanTabletMedia} {
    flex-direction: ${({ justify }) =>
      justify.includes('end') ? 'row-reverse' : 'row'};
  }
`;
