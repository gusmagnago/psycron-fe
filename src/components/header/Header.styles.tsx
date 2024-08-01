import { Box, styled } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const HeaderWrapper = styled(Box)`
  height: var(--header-heigh);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.mediumLarge};
  z-index: 10;
`;
