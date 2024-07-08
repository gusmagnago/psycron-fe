import { Box, Grid, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain, shadowPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const TableBodyWrapper = styled(Grid)`
  align-items: center;
`;

export const TableBodyRow = styled(Box)`
  display: flex;
  height: 50px;
`;

export const TableBodyRowItem = styled(Grid)``;

export const StyledRow = styled(Box)`
  display: flex;
  width: 100%;

  border-radius: 30px;
  background-color: ${palette.background.paper};
  box-shadow: ${shadowMain};
  padding: ${spacing.small};

  &:hover {
    background-color: ${palette.secondary.surface.light};
    box-shadow: ${shadowPress};
  }
`;
