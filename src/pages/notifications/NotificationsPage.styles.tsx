import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Link } from '@psycron/components/link/Link';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const NotificationStatusPill = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor: string }>`
	align-items: center;
	background: ${({ statusColor }) => hexToRgba(statusColor, 0.1)};
	border: 1px solid ${({ statusColor }) => hexToRgba(statusColor, 0.18)};
	border-radius: 999px;
	color: ${({ statusColor }) => statusColor};
	display: inline-flex;
	font-size: 0.68rem;
	font-weight: 700;
	gap: ${spacing.xxs};
	padding: ${spacing.xxs} ${spacing.xs};
	text-transform: uppercase;
`;

export const NotificationChannelLabel = styled(Text)`
	color: var(--feature-page-accent, ${palette.secondary.main});
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
`;

export const NotificationTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.98rem;
	font-weight: 700;

	${isMobileMedia} {
		font-size: 0.95rem;
	}
`;

export const NotificationPreview = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.88rem;
	line-height: 1.55;

	${isMobileMedia} {
		font-size: 0.84rem;
	}
`;

export const NotificationCardDate = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.8rem;
`;

export const NotificationCardInfo = styled(Text)`
	color: ${palette.gray['06']};
	font-size: 0.8rem;
	line-height: 1.45;
`;

export const NotificationCardActions = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	justify-content: space-between;
	width: 100%;

	${isMobileMedia} {
		align-items: flex-start;
		flex-direction: column;
	}
`;

export const NotificationSettingsLink = styled(Link)`
	align-items: center;
	border-radius: ${spacing.xs};
	display: inline-flex;
	gap: ${spacing.xs};
	padding: ${spacing.xs};

	svg {
		height: ${spacing.small};
		width: ${spacing.small};
	}
`;

export const ContextList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const BulkActionsRow = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
	justify-content: space-between;
`;

export const SortControlWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const FiltersContent = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;
