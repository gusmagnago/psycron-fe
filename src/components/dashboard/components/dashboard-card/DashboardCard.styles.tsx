import { Box, styled } from '@mui/material';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const DashboardCardWrapper = styled(Box)`
  box-shadow: ${shadowMain};
  border-radius: calc(2 * ${spacing.mediumSmall});
  width: 100%;
  padding: ${spacing.small};

  ${isBiggerThanMediumMedia} {
    padding: ${spacing.medium};
  }
`;

export const DashboardCardTitle = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.small};

  svg {
    color: ${palette.primary.main};
    width: 30px;
    height: 30px;

    &:hover {
      color: ${palette.secondary.main};
    }
  }
`;

export const ScrollBox = styled(Box)`
    overflow-y: scroll;
    overflow-x: hidden;
    padding: ${spacing.small};
    max-height: 300px;
`

export const Timer = styled(Box)`
  display: flex;
  align-items: center;

  margin: ${spacing.small};
`;

export const ModalPauseTimerContent = styled(Box)`
  padding: ${spacing.mediumLarge};
`;


export const ModalContent = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`