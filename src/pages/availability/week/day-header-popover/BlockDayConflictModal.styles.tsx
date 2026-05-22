import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ConflictSummaryNote = styled(Box)`
	padding: ${spacing.small} ${spacing.medium};
	background: ${palette.warning.light};
	border-radius: ${spacing.xs};
	color: ${palette.warning.dark};
	font-size: 0.875rem;
	margin-bottom: ${spacing.small};
`;

export const BookedSlotList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	margin-top: ${spacing.small};
`;

export const BookedSlotItem = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.xs} ${spacing.small};
	border: 1px solid ${palette.gray['02']};
	border-radius: ${spacing.xs};
	font-size: 0.875rem;
`;

export const BookedSlotTime = styled('span')`
	font-weight: 600;
	color: ${palette.brand.purple};
	min-width: 60px;
`;
