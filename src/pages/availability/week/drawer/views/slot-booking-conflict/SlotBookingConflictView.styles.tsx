import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ConflictContent = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const ConflictBody = styled(Text)`
	font-size: 0.9rem;
	color: ${palette.gray['05']};
`;

export const ConflictPatientName = styled(Text)`
	font-weight: 600;
	color: ${palette.brand.purple};
`;
