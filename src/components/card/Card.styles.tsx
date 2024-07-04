import styled from '@emotion/styled';
import { Card  as MUICard} from '@mui/material';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const CardWrapper = styled(MUICard, {shouldForwardProp: (props) => props !== 'isModal'})<{isModal?: boolean}>`
  box-shadow: ${shadowMain};
  margin: ${spacing.mediumSmall} ${spacing.small};
`;
