import { css, styled, Typography } from '@mui/material';

export const StyledTypography = styled(Typography, {
	shouldForwardProp: (props) => props !== 'isFirstUpper',
})<{ isFirstUpper?: boolean }>`
  ${({ isFirstUpper }) =>
		isFirstUpper
			? css`
          &::first-letter {
            text-transform: uppercase;
          }
        `
			: css``}
`;
