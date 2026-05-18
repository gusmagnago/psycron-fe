import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { bentoTileTheme } from '@psycron/theme/dashboard/bentoTile.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BentoTileFooter = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	gap: ${spacing.small};
	justify-content: space-between;
	min-height: ${bentoTileTheme.footer.minHeight};
`;

export const BentoTileFooterSlot = styled(Box)`
	align-items: center;
	display: flex;
	min-width: 0;
`;

export const BentoTileActionsSlot = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	justify-content: flex-end;
	min-width: 0;
`;
