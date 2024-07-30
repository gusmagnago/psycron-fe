import { Box, styled } from '@mui/material';

import { Text } from '@psycron/components/text/Text';
import {
  isBiggerThanTabletMedia,
  isBiggerThanMediumMedia,
  isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';

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

export const Call2ActionFooterWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: ${spacing.large} ${spacing.large} 0;
`;

export const Call2ActionFooter = styled(Box)`
  width: 100%;
  ${isBiggerThanTabletMedia} {
    width: 50%;
  }
`;

export const Call2ActionInputWrapper = styled(Box)`
  padding: ${spacing.mediumLarge};
`;
