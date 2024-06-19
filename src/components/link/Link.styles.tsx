import { Link as RRDLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledLink = styled(RRDLink)`
  margin: 0 ${spacing.xs} ${spacing.xs};
  text-decoration: none;
  color: ${palette.secondary.main};
  transition: color 0.2s ease-out;
  &:hover {
    color: ${palette.secondary.action.press};
    transform: scale(1.1);
    transition: transform 0.2s ease-out;
  }
`;
