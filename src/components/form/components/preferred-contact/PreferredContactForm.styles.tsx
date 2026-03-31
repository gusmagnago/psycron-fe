import styled from '@emotion/styled';
import { Box, InputLabel, TextField } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PreferredContactWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: ${spacing.small};
`;

export const PreferredContactFields = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	width: 100%;
`;

export const PreferredContactTypeSelect = styled(TextField)`
	margin-bottom: ${spacing.xs};
`;

export const PreferredContactUrlInputLabel = styled(InputLabel)`
	margin-left: 0;
`;
