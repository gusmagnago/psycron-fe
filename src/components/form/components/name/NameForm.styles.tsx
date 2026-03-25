import { Box, styled } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const NameFormWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: ${spacing.small};
`;

export const NameInputWrapper = styled(Box)`
	width: 100%;
`;
