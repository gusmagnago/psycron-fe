import styled from '@emotion/styled';
import { Box, TextField } from '@mui/material';
import {
	QueueDetailLayout,
	QueueDetailSidebar,
	QueueFilterChip,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
	QueueList,
	QueueSelectableCard,
	QueueSelectableCardMetaRow,
	QueueSidebarCount,
	QueueSidebarHeaderWrapper,
	QueueSidebarSubtitle,
	QueueSidebarTitle,
	QueueSidebarTitleRow,
	QueueStatCard,
	QueueStatLabel,
	QueueStatsGrid,
	QueueStatValue,
} from '@psycron/components/queue-panel';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const NotificationsLayout = QueueDetailLayout;
export const NotificationsSidebar = QueueDetailSidebar;
export const SidebarHeader = QueueSidebarHeaderWrapper;
export const SidebarTitleRow = QueueSidebarTitleRow;
export const SidebarTitle = QueueSidebarTitle;
export const SidebarCount = QueueSidebarCount;
export const SidebarSubtitle = QueueSidebarSubtitle;
export const NotificationsStatsGrid = QueueStatsGrid;
export const NotificationsStatCard = QueueStatCard;
export const NotificationsStatLabel = QueueStatLabel;
export const NotificationsStatValue = QueueStatValue;
export const FiltersSection = QueueFiltersSection;
export const FiltersLabel = QueueFiltersLabel;
export const FiltersRow = QueueFiltersRow;
export const FilterChip = QueueFilterChip;
export const NotificationsList = QueueList;
export const NotificationCard = QueueSelectableCard;
export const NotificationCardMetaRow = QueueSelectableCardMetaRow;

export const SearchField = styled(TextField)`
	.MuiInputBase-root {
		background: ${palette.background.default};
		border-radius: ${spacing.medium};
		font-size: 0.9rem;
	}
`;

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
	padding: 0.15rem ${spacing.xs};
	text-transform: uppercase;
`;

export const NotificationChannelLabel = styled(Text)`
	color: ${palette.secondary.main};
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

export const DetailPanel = styled(Box)`
	background: ${palette.background.paper};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.1)};
	border-radius: ${spacing.large};
	box-shadow: ${shadowMedium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.mediumSmall};
	min-height: 32rem;
	padding: ${spacing.large};

	${isMobileMedia} {
		padding: ${spacing.medium};
	}
`;

export const DetailHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const DetailEyebrow = styled(Text)`
	color: ${palette.secondary.main};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
`;

export const DetailTitleRow = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	justify-content: space-between;
`;

export const DetailTitle = styled(Text)`
	font-size: 1.4rem;
	font-weight: 700;
`;

export const DetailSubtitle = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.92rem;
	line-height: 1.5;
`;

export const DetailGrid = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(2, minmax(0, 1fr));

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const DetailCard = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.small};
`;

export const DetailLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const DetailValue = styled(Text)`
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.5;
	overflow-wrap: anywhere;
`;

export const MessagePreview = styled(Box)`
	background: ${palette.background.default};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.16)};
	border-radius: ${spacing.medium};
	color: ${palette.text.primary};
	font-size: 0.92rem;
	line-height: 1.6;
	padding: ${spacing.medium};
	white-space: pre-wrap;
`;

export const PayloadPreview = styled(Box)`
	background: ${hexToRgba(palette.gray['01'], 0.7)};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.16)};
	border-radius: ${spacing.medium};
	color: ${palette.gray['08']};
	font-family: monospace;
	font-size: 0.78rem;
	line-height: 1.55;
	max-height: 12rem;
	overflow: auto;
	padding: ${spacing.small};
	white-space: pre-wrap;
`;

export const ActionsRow = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};
	margin-top: auto;
`;

export const FiltersContent = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;
