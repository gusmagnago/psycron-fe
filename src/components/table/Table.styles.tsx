import { Paper, styled } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledPaper = styled(Paper)`
  width: 100%;
  padding: ${spacing.medium};
  border-radius: calc(2 * ${spacing.mediumSmall});
`;
