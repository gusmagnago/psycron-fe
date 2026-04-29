import styled from '@emotion/styled';
import { Box, IconButton, MenuItem } from '@mui/material';
import {
	QueueDetailLayout,
	QueueDetailSidebar,
	QueueEmptyState as SharedQueueEmptyState,
	QueueFilterChip,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
	QueueFiltersToggleButton,
	QueueFiltersToggleContent,
	QueueFiltersToggleSubtitle,
	QueueFiltersToggleTitle,
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
export const RecoveryLayout = QueueDetailLayout;
export const RecoverySidebar = QueueDetailSidebar;
export const SidebarHeader = QueueSidebarHeaderWrapper;
export const SidebarTitleRow = QueueSidebarTitleRow;
export const SidebarTitle = QueueSidebarTitle;
export const SidebarCount = QueueSidebarCount;
export const SidebarSubtitle = QueueSidebarSubtitle;

export const RecoveryStatsGrid = QueueStatsGrid;
export const RecoveryStatCard = QueueStatCard;
export const RecoveryStatLabel = QueueStatLabel;
export const RecoveryStatValue = QueueStatValue;

export const FiltersSection = QueueFiltersSection;

export const FiltersToggleButton = QueueFiltersToggleButton;
export const FiltersToggleContent = QueueFiltersToggleContent;
export const FiltersToggleTitle = QueueFiltersToggleTitle;
export const FiltersToggleSubtitle = QueueFiltersToggleSubtitle;

export const FiltersContent = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const FiltersLabel = QueueFiltersLabel;
export const FiltersRow = QueueFiltersRow;
export const FilterChip = QueueFilterChip;
export const RecoveryList = QueueList;

export const SidebarBulkAction = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const RecoveryCard = styled(QueueSelectableCard, {
	shouldForwardProp: (prop) => prop !== 'state',
})<{
	state:
		| 'pending_follow_up'
		| 'overdue'
		| 'followed_up'
		| 'reopened'
		| 'rebooked'
		| 'archived';
}>``;
export const RecoveryCardMeta = QueueSelectableCardMetaRow;

export const RecoveryCardTitle = styled(Text)`
	font-size: 0.98rem;
	font-weight: 700;
`;

export const RecoveryCardBody = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.85rem;
	line-height: 1.45;
`;

export const RecoveryStatePill = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'state',
})<{
	state:
		| 'pending_follow_up'
		| 'overdue'
		| 'followed_up'
		| 'reopened'
		| 'rebooked'
		| 'archived';
}>`
	align-items: center;
	background: ${({ state }) =>
		state === 'reopened'
			? hexToRgba(palette.success.main, 0.12)
			: state === 'followed_up'
				? hexToRgba(palette.secondary.main, 0.12)
			: state === 'rebooked'
				? hexToRgba(palette.info.main, 0.1)
				: state === 'archived'
					? hexToRgba(palette.gray['04'], 0.12)
					: state === 'overdue'
						? hexToRgba(palette.warning.main, 0.12)
						: hexToRgba(palette.error.main, 0.1)};
	border: 1px solid
		${({ state }) =>
			state === 'reopened'
				? hexToRgba(palette.success.main, 0.2)
				: state === 'followed_up'
					? hexToRgba(palette.secondary.main, 0.18)
				: state === 'rebooked'
					? hexToRgba(palette.info.main, 0.18)
					: state === 'archived'
						? hexToRgba(palette.gray['04'], 0.24)
						: state === 'overdue'
							? hexToRgba(palette.warning.main, 0.2)
							: hexToRgba(palette.error.main, 0.18)};
	border-radius: 999px;
	color: ${({ state }) =>
		state === 'reopened'
			? palette.success.main
			: state === 'followed_up'
				? palette.secondary.main
			: state === 'rebooked'
				? palette.info.main
				: state === 'archived'
					? palette.gray['06']
					: state === 'overdue'
						? palette.warning.main
						: palette.error.main};
	display: inline-flex;
	font-size: 0.55rem;
	font-weight: 700;
	padding: 0.15rem ${spacing.xs};
	text-transform: uppercase;
	max-width: 5rem;
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
`;

export const ActionsRow = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};
	margin-top: auto;
`;

export const ActionMenuButton = styled(IconButton)`
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.2)};
	color: ${palette.gray['06']};
	height: 2.5rem;
	width: 2.5rem;
`;

export const ActionMenuItem = styled(MenuItem)`
	color: ${palette.gray['07']};
	font-size: 0.92rem;
	font-weight: 600;
	min-height: 2.75rem;
`;

export const EmptyPanel = SharedQueueEmptyState;

export const EmptyPanelText = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.95rem;
	line-height: 1.55;
	max-width: 26rem;
`;
