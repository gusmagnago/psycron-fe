import { Box, styled } from '@mui/material';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PatientsCardWrapper = styled(Box)`
  box-shadow: ${shadowMain};
  border-radius: calc(2 * ${spacing.mediumSmall});
  width: 100%;
  padding: ${spacing.small};

  ${isBiggerThanMediumMedia} {
    padding: ${spacing.medium};
  }
`;

export const PatientsCardTitle = styled(Box)`
  display: flex;
  justify-content: space-between;
  svg {
    color: ${palette.primary.main};
    width: 30px;
    height: 30px;

    &:hover {
      color: ${palette.secondary.main};
    }
  }
`;
