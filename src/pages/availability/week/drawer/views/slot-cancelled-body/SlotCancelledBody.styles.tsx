import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const CancelledIconWrapper = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: ${spacing.medium} 0 ${spacing.small};
`;

export const CancelledReasonSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small} 0;
	border-top: 1px solid ${palette.gray['02']};
`;

export const CancelledReasonLabel = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.gray['05']};
`;

export const CancelledReasonValue = styled(Text)`
	font-size: 14px;
	color: ${palette.text.primary};
`;

export const CancelledAtText = styled(Text)`
	font-size: 11px;
	color: ${palette.gray['05']};
	padding-top: ${spacing.xs};
`;
