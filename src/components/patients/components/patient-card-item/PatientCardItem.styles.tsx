import { Box, Divider, styled } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PatientCardItemWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.small} 0;

  &:hover {
    box-shadow: ${shadowMain};
    border-radius: ${spacing.mediumSmall};
    background-color: ${palette.secondary.surface.light};
    cursor: pointer;

    color: ${palette.secondary.access};
    svg {
         color: ${palette.secondary.access};
    }
  }
`;

export const SmallDivider = styled(Divider)`
  border-width: 2px;

  ${isBiggerThanTabletMedia} {
    border-width: 4px;
  }
`;
