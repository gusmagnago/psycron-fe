import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const OtpWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${spacing[4]};
	max-width: 400px;
	width: 100%;
	padding: ${spacing[6]};
`;
