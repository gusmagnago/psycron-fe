import { Box, css, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledCellWrapper = styled(Box)`
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FullAmountItem = styled(Box)`
  background-color: ${palette.success.surface.light};
  border-radius: 15px;
  padding: ${spacing.xs};
`;

export const HasDiscountCell = styled(Box, {
	shouldForwardProp: (props) => props !== 'label',
})<{ label: string }>`
  display: flex;
  border: 1px solid ${palette.error.main};
  background-color: ${palette.error.surface.light};
  border-radius: 20px;
  padding: ${spacing.xs};

  ${({ label }) =>
		label.includes('Yes')
			? css`
          border: 1px solid ${palette.success.main};
          background-color: ${palette.success.surface.light};
        `
			: css`
          border: 1px solid ${palette.error.main};
          background-color: ${palette.error.surface.light};
        `};
`;

export const DateCell = styled(Box, {
	shouldForwardProp: (props) => props !== 'id',
})<{ id: string }>`
  font-size: 0.7rem;

  ${({ id }) =>
		id === 'nextSession'
			? css`
          border: 1px solid ${palette.tertiary.main};
          background-color: ${palette.tertiary.surface.light};
          padding: ${spacing.xs};
          border-radius: 20px;
          & > * {
            font-weight: 500;
          }
        `
			: css``};
`;
