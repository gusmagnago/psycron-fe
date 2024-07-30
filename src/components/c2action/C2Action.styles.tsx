import { styled, Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
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
`;

export const C2ActionBox = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: auto;
  padding: ${spacing.small};

  ${isBiggerThanTabletMedia} {
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

  ${isBiggerThanTabletMedia} {
    margin-left: ${spacing.small};
    margin-top: 0;
    width: 8.125rem;
  }
`;

export const HighlightedText = styled('span')`
  color: ${palette.secondary.main};
  font-weight: 600;
`;
