import { Box, styled, TextField } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const SignUpWrapper = styled(Box)`
  padding: ${spacing.medium} ${spacing.mediumSmall};
`;

export const LogoWrapper = styled(Box)`
  svg {
    width: 50%;
  }
`;

export const InputFields = styled(TextField)`
  margin: ${spacing.small} 0;

  :first-child {
    margin-right: ${spacing.small};
  }
  :last-child {
      margin-left: ${spacing.small};
  }
`;
