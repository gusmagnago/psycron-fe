import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BentoTileHeader = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	gap: ${spacing.xs};
	justify-content: space-between;
	min-width: 0;
	padding-bottom: ${spacing.xs};
`;

export const BentoTileHeaderActions = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;

	& button {
		padding: ${spacing.xs};
	}
`;
