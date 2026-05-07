import styled from '@emotion/styled';
import { IconButton, MenuItem } from '@mui/material';
import { Box } from '@mui/material';
import { QueueSelectableCard } from '@psycron/components/queue-panel';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { CancellationRecoveryState } from './CancellationRecoveryPage.types';

export const RecoveryCard = styled(QueueSelectableCard, {
	shouldForwardProp: (prop) => prop !== 'state',
})<{ state: CancellationRecoveryState }>``;

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
})<{ state: CancellationRecoveryState }>`
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
	max-width: 5rem;
	padding: 0.15rem ${spacing.xs};
	text-transform: uppercase;
`;

export const SidebarBulkAction = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const FiltersContent = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
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

export const EmptyPanelText = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.95rem;
	line-height: 1.55;
	max-width: 26rem;
`;
