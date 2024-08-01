import { Box, styled, TextField } from '@mui/material';
import { shadowPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const InputFields = styled(TextField)`
  margin: ${spacing.small} 0;
  box-sizing: border-box;
  max-width: 400px;
`;

export const SignUpWrapper = styled(Box)`
  padding: ${spacing.medium} ${spacing.mediumSmall};

  height: auto;
  border-radius: calc(2 * ${spacing.mediumSmall});
  box-shadow: ${shadowPress};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const LogoWrapper = styled(Box)`
  svg {
    width: 50%;
  }
`;
