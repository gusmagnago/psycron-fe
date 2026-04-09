import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BlockedIconWrapper = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: ${spacing.medium} 0 ${spacing.small};
`;

export const BlockedReasonSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small} 0;
	border-top: 1px solid ${palette.gray['02']};
`;

export const BlockedReasonLabel = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.gray['05']};
`;

export const BlockedReasonValue = styled(Text)`
	font-size: 14px;
	color: ${palette.text.primary};
`;

export const BlockedAtText = styled(Text)`
	font-size: 11px;
	color: ${palette.gray['05']};
	padding-top: ${spacing.xs};
`;
