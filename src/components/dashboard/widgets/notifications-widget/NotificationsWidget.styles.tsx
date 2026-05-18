import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const NotificationsRoot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isWide',
})<{ isWide?: boolean }>`
	display: flex;
	flex-direction: ${({ isWide }) => (isWide ? 'row' : 'column')};
	gap: ${spacing.small};
	height: 100%;
	justify-content: flex-start;
	min-width: 0;
`;

export const NotificationStatsGrid = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(3, minmax(0, 1fr));
`;

export const NotificationStatButton = styled('button')`
	background: ${palette.gray['01']};
	border: 1px solid ${palette.gray['02']};
	border-radius: ${spacing.xs};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
	min-width: 0;
	padding: ${spacing.xs};
	text-align: left;
	transition:
		background 0.16s ease,
		border-color 0.16s ease;

	&:hover {
		background: ${dashboardAccents.info.surface};
		border-color: ${dashboardAccents.info.border};
	}

	&:focus-visible {
		outline: 2px solid ${dashboardAccents.info.main};
		outline-offset: 2px;
	}
`;

export const NotificationStatLabel = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.75rem;
	font-weight: 800;
	line-height: 1;
	text-transform: uppercase;
`;

export const NotificationStatValue = styled(Text)`
	color: ${palette.text.primary};
	font-size: 1.5rem;
	font-weight: 800;
	line-height: 1;
`;

export const NotificationFooter = styled(Box)`
	align-items: center;
	display: flex;
	justify-content: space-between;
	gap: ${spacing.small};
	margin-top: auto;
`;

export const ChannelCounters = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};
`;

export const ChannelCounter = styled(Text)`
	align-items: center;
	color: ${palette.text.secondary};
	display: inline-flex;
	font-size: 0.8125rem;
	font-weight: 800;
	gap: ${spacing.space};

	& svg {
		height: 1rem;
		width: 1rem;
	}
`;

export const ViewFeedButton = styled('button')`
	align-items: center;
	background: transparent;
	border: 0;
	color: ${palette.text.secondary};
	cursor: pointer;
	display: inline-flex;
	font: inherit;
	font-size: 0.8125rem;
	font-weight: 800;
	gap: ${spacing.space};
	padding: ${spacing.space};

	&:hover {
		color: ${palette.text.primary};
	}

	&:focus-visible {
		border-radius: ${spacing.xs};
		outline: 2px solid ${dashboardAccents.info.main};
		outline-offset: 2px;
	}
`;

export const NotificationSkeleton = styled(Skeleton)`
	border-radius: ${spacing.xs};
`;
