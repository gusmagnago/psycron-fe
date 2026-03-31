import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PageWrapper = styled(Box)`
	max-width: 560px;
	margin: 0 auto;
	padding: ${spacing.large} ${spacing.small};
`;

export const ConfirmationCard = styled(Box)`
	background: ${palette.white};
	border: 1px solid ${palette.gray['02']};
	border-radius: 12px;
	padding: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const DetailRow = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const AgendaLinkBox = styled(Box)`
	background: ${palette.primary.light};
	border-radius: 8px;
	margin-top: ${spacing.small};
	padding: ${spacing.small};
	word-break: break-all;
`;
