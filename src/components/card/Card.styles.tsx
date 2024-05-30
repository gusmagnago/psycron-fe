import styled from '@emotion/styled';
import { Card } from '@mui/material';
// import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const CardWrapper = styled(Card)`
  box-shadow: ${shadowMain};
  margin: ${spacing.mediumSmall} ${spacing.small};
`;
