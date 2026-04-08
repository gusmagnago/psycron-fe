import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PopoverContent = styled(Box)`
	padding: ${spacing.small};
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	min-width: 20rem;

	${isMobileMedia} {
		padding: ${spacing.medium};
	}
`;

export const PopoverTitle = styled(Text)`
	font-size: 14px;
	font-weight: 600;
	color: ${palette.text.primary};
`;

export const SummaryRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};
`;

export const SummaryChip = styled(Text)`
	font-size: 12px;
	color: ${palette.gray['05']};
	line-height: 1.5;
`;

export const BookedWarning = styled(Text)`
	font-size: 12px;
	color: ${palette.warning.dark};
	background: ${palette.warning.light};
	padding: ${spacing.xs} ${spacing.small};
	border-radius: ${spacing.xs};
	line-height: 1.4;
`;

export const PopoverActions = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	border-top: 1px solid ${palette.gray['02']};
	padding-top: ${spacing.small};
`;
