import { Box, CircularProgress, styled } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledBttnContentWrapper = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	width: 100%;

	gap: ${spacing.space};
	& svg {
		stroke-width: 1px;
	}
`;

export const BttnLoader = styled(CircularProgress)`
	position: absolute;
	pointer-events: none;
	left: 40%;
`;
