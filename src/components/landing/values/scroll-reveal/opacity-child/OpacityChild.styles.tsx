import { styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';

export const StyledText = styled(Text)`
  font-size: 1.2rem;
  font-weight: 500;

  ${isBiggerThanMediumMedia} {
    font-size: 2rem;
    font-weight: 600;
  }
`;
