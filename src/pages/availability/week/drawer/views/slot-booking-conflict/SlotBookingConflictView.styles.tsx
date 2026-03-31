import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ConflictWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding: ${spacing.small};
	border: 1px solid ${palette.warning.main};
	border-radius: ${spacing.mediumSmall};
`;

export const ConflictTitle = styled(Text)`
	font-weight: 600;
	color: ${palette.gray['07']};
`;

export const ConflictBody = styled(Text)`
	font-size: 0.9rem;
	color: ${palette.gray['05']};
`;

export const ConflictPatientName = styled(Text)`
	font-weight: 600;
	color: ${palette.brand.purple};
`;

export const ConflictActions = styled(Box)`
	display: flex;
	gap: ${spacing.xs};
	flex-direction: column;
`;

export const ConflictActionButton = styled(Button)`
	width: 100%;
`;
