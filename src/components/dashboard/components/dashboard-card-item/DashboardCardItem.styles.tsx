import { Box, css, Divider, Grid, styled } from '@mui/material';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain, shadowPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const DashboardCardItemWrapper = styled(Box, {
	shouldForwardProp: (props) =>
		props !== 'isPatientCard' && props !== 'lessThanThirtyMinutes',
})<{ isPatientCard?: boolean; lessThanThirtyMinutes?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.space} 0;
  border-radius: ${spacing.mediumSmall};

  border: 3px solid transparent;

  ${({ lessThanThirtyMinutes }) =>
		lessThanThirtyMinutes
			? css`
          background-color: ${palette.alert.main};
          box-shadow: ${shadowPress};
        `
			: 'transparent'};

  &:hover {
    box-shadow: ${shadowMain};

    ${({ isPatientCard, lessThanThirtyMinutes }) =>
		isPatientCard
			? css`
            background-color: ${palette.secondary.surface.light};
            color: ${palette.secondary.access};
            svg {
              color: ${palette.secondary.access};
            }
          `
			: lessThanThirtyMinutes
				? css`
              border: 3px solid ${palette.alert.action.hover};
              svg {
                color: ${palette.alert.action.hover};
              }
            `
				: css`
              border: 3px solid ${palette.tertiary.action.hover};
            `}

    cursor: pointer;
    transform: scale(1.03);
  }
`;

export const SmallDivider = styled(Divider)`
  border-width: 2px;

  ${isBiggerThanTabletMedia} {
    border-width: 4px;
  }
`;

export const GridDivider = styled(Grid)`
  display: flex;
  height: 2rem;
`;


export const DashboardCardTooltip = styled(Tooltip)`

  &:hover {
    border-radius: ${spacing.mediumSmall};
  }
`