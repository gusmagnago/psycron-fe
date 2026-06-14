import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BusyNoteSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small} 0;
	border-top: 1px solid ${palette.gray['02']};
`;

export const BusyNoteLabel = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.gray['05']};
`;

export const BusyNoteText = styled(Text)`
	font-size: 14px;
	color: ${palette.text.primary};
	line-height: 1.6;
`;

export const BusyCommitmentValue = styled(Text)`
	font-size: 14px;
	font-weight: 600;
	color: ${palette.text.primary};
	line-height: 1.6;
`;

export const BusyInfoTag = styled(Box)`
	display: inline-flex;
	align-items: center;
	gap: ${spacing.space};
	padding: ${spacing.space} ${spacing.mediumSmall};
	border-radius: ${spacing.extraSmall};
	background: ${hexToRgba(palette.gray['08'], 0.1)};
	color: ${palette.gray['08']};
	font-size: 12px;
	font-weight: 600;
	width: fit-content;
`;
