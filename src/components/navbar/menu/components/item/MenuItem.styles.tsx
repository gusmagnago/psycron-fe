import { Box, css, styled } from '@mui/material';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { IMenuItem } from './MenuItem.types';

export const StyledMenuItem = styled(Tooltip, {
	shouldForwardProp: (prop) => prop !== 'isFooterIcon',
})<Pick<IMenuItem, 'isFooterIcon'>>`
  border-radius: 50%;

  padding: ${({ isFooterIcon }) =>
		!isFooterIcon ? spacing.xs : spacing.small};

  &:hover {
    ${({ isFooterIcon }) =>
		isFooterIcon
			? css`
            box-shadow: ${shadowMain};
            background-color: ${palette.secondary.surface.light};
            color: ${palette.secondary.main};

            & > svg {
              color: ${palette.secondary.main};
            }
          `
			: css`
            background-color: transparent;
          `}
  }

  svg {
    height: ${({ isFooterIcon }) => (!isFooterIcon ? '25px' : 'auto')};
    width: 30px;
    color: ${palette.text.primary};
    stroke-width: 1.5;
  }
`;

export const MobileMenuItem = styled(Box)`
display: flex;
flex-direction: row;
align-items: center;
`