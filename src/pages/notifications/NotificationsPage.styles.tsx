import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Link } from '@psycron/components/link/Link';
import {
	QueueActionsRow,
	QueueDetailCard,
	QueueDetailEyebrow,
	QueueDetailGrid,
	QueueDetailHeader,
	QueueDetailLabel,
	QueueDetailLayout,
	QueueDetailMessage,
	QueueDetailPanel,
	QueueDetailSidebar,
	QueueDetailSubtitle,
	QueueDetailTitle,
	QueueDetailTitleRow,
	QueueDetailValue,
	QueueFilterChip,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
	QueueList,
	QueueSearchField,
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
import {
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
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
export const SearchField = QueueSearchField;

export const FeedToggleWrapper = styled(Box)`
	display: none;
	justify-content: flex-end;

	${isSmallerThanTabletMedia} {
		display: flex;
	}
`;

export const DetailPanelWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isHidden',
})<{ isHidden?: boolean }>`
	display: block;
	min-width: 0;

	${isSmallerThanTabletMedia} {
		display: ${({ isHidden }) => (isHidden ? 'none' : 'block')};
	}
`;

export const ExpandableFeedContent = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isExpanded',
})<{ isExpanded?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	min-height: 0;

	${isSmallerThanTabletMedia} {
		display: ${({ isExpanded }) => (isExpanded ? 'flex' : 'none')};
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
	padding: ${spacing.xxs} ${spacing.xs};
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

export const NotificationCardInfo = styled(Text)`
	color: ${palette.gray['06']};
	font-size: 0.8rem;
	line-height: 1.45;
`;

export const NotificationCardActions = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
	flex-wrap: wrap;
	justify-content: space-between;
	width: 100%;

	${isMobileMedia} {
		align-items: flex-start;
		flex-direction: column;
	}
`;

export const DetailPanel = QueueDetailPanel;
export const DetailHeader = QueueDetailHeader;
export const DetailEyebrow = QueueDetailEyebrow;
export const DetailTitleRow = QueueDetailTitleRow;
export const DetailTitle = QueueDetailTitle;
export const DetailSubtitle = QueueDetailSubtitle;
export const DetailGrid = QueueDetailGrid;
export const DetailCard = QueueDetailCard;
export const DetailLabel = QueueDetailLabel;
export const DetailValue = QueueDetailValue;
export const MessagePreview = QueueDetailMessage;
export const ActionsRow = QueueActionsRow;

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
	flex-direction: column;
	gap: ${spacing.xs};
	justify-content: space-between;
	align-items: flex-start;
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
