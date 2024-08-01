import { styled, Box, TextField } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import {
  isBiggerThanMediumMedia,
  isBiggerThanTabletMedia,
  isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';

export const C2ActionWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: ${spacing.mediumSmall};
  border-radius: ${spacing.medium};
  box-shadow: ${shadowMain};
  border: 1px solid rgba(255, 255, 255, 0.3);

  background-color: ${palette.background.paper};

  width: 100%;
  margin-top: ${spacing.large};

  ${isBiggerThanMediumMedia} {
    width: 50%;
  }

  ${isMobileMedia} {
    padding: ${spacing.small};
  }
`;

export const C2ActionBox = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: auto;
  padding: ${spacing.small};

  ${isBiggerThanMediumMedia} {
    flex-direction: row;
  }
`;

export const C2ActionText = styled(Text)`
  text-align: left;

  ${isBiggerThanTabletMedia} {
    text-align: center;
  }
`;

export const C2ActionButton = styled(Button)`
  width: 100%;
  margin-left: 0;
  margin-top: ${spacing.small};

  ${isBiggerThanMediumMedia} {
    margin-left: ${spacing.small};
    margin-top: 0;
    width: 12rem;
  }

  ${isMobileMedia} {
    margin-top: ${spacing.xs};
  }
`;

export const HighlightedText = styled('span')`
  color: ${palette.secondary.main};
  font-weight: 600;
`;

export const StyledTextField = styled(TextField)`
  text-align: center;
`;
