import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const SectionWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const SectionHeader = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};

	& svg {
		width: 14px;
		height: 14px;
	}
`;

export const SectionLabel = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.gray['05']};
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

export const BookingLinkSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small};
	border: 1px solid ${hexToRgba(palette.brand.purple, 0.18)};
	border-radius: ${spacing.mediumSmall};
	background: ${palette.brand.light};
`;

export const BookingLinkHeader = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.small};
`;

export const BookingLinkLabel = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.gray['05']};
`;

export const BookingLinkValueRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const BookingLinkValue = styled(Text)`
	flex: 1;
	min-width: 0;
	font-size: 13px;
	font-weight: 500;
	color: ${palette.brand.dark};
	line-height: 1.5;
	word-break: break-all;
`;

export const BookingLinkHint = styled(Text)`
	font-size: 12px;
	color: ${palette.gray['05']};
	line-height: 1.5;
`;

export const ReopenedNote = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
	padding: ${spacing.small};
	border-radius: ${spacing.mediumSmall};
	background: ${hexToRgba(palette.warning.main, 0.08)};
	border: 1px solid ${hexToRgba(palette.warning.main, 0.18)};
`;

export const ReopenedNoteLabel = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.warning.dark};
`;

export const ReopenedNoteText = styled(Text)`
	font-size: 13px;
	color: ${palette.text.primary};
	line-height: 1.5;
`;
