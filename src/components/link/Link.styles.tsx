import { Link as RRDLink } from 'react-router-dom';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { ILinkStyledProps } from './Link.types';

export const StyledLink = styled(RRDLink, {
	shouldForwardProp: (props) => props !== 'firstLetterUpper',
})<ILinkStyledProps>`
  margin: 0 ${spacing.xs} 0;
  text-decoration: none;
  color: ${palette.secondary.main};
  transition: color 0.2s ease-out;
  &:hover {
    color: ${palette.secondary.action.press};
    transform: scale(1.1);
    transition: transform 0.2s ease-out;
  }
  ${({ firstLetterUpper }) =>
		firstLetterUpper &&
    css`
      &::first-letter {
        text-transform: uppercase;
      }
    `}
`;
