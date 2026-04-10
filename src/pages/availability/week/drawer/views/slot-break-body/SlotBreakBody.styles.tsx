import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BreakNoteSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small} 0;
	border-top: 1px solid ${palette.gray['02']};
`;

export const BreakNoteLabel = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.gray['05']};
`;

export const BreakNoteText = styled(Text)`
	font-size: 14px;
	color: ${palette.text.primary};
	line-height: 1.6;
`;

export const BreakInfoTag = styled(Box)`
	display: inline-flex;
	align-items: center;
	padding: ${spacing.space} ${spacing.mediumSmall};
	border-radius: ${spacing.extraSmall};
	background: ${hexToRgba(palette.brand.purple, 0.08)};
	color: ${palette.brand.purple};
	font-size: 12px;
	font-weight: 600;
	width: fit-content;
`;
