import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowDashboardTile } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const RevenueRoot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isInteractive' && prop !== 'isWide',
})<{ isInteractive?: boolean; isWide?: boolean }>`
	display: flex;
	flex-direction: ${({ isWide }) => (isWide ? 'row' : 'column')};
	gap: ${spacing.small};
	height: 100%;
	justify-content: flex-start;
	min-width: 0;
	text-align: left;
	cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};

	&:focus-visible {
		border-radius: ${spacing.xs};
		outline: 2px solid ${dashboardAccents.info.main};
		outline-offset: 2px;
	}
`;

export const RevenueValueRow = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const RevenueEmpty = styled(Box)`
	align-items: center;
	background: ${hexToRgba(palette.brand.purple, 0.06)};
	border: 1px solid ${hexToRgba(palette.brand.purple, 0.14)};
	border-radius: ${spacing.medium};
	box-shadow: ${shadowDashboardTile};
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xs};
	justify-content: center;
	min-height: 0;
	padding: ${spacing.mediumSmall};
	text-align: center;
`;

export const RevenueEmptyIcon = styled(Box)`
	align-items: center;
	background: ${palette.white};
	border-radius: 999px;
	box-shadow: ${shadowDashboardTile};
	color: ${palette.brand.purple};
	display: inline-flex;
	font-size: 1rem;
	font-weight: 900;
	height: 2.25rem;
	justify-content: center;
	width: 2.25rem;
`;

export const RevenueEmptyTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.9rem;
	font-weight: 850;
`;

export const RevenueEmptyBody = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.78rem;
	font-weight: 650;
	line-height: 1.4;
`;

export const RevenueValue = styled(Text)`
	color: ${palette.text.primary};
	font-size: 2.25rem;
	font-weight: 800;
	letter-spacing: 0;
	line-height: 1;
`;

export const RevenueDetailGrid = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: 1fr;
	margin-top: auto;
`;

export const RevenueDetailRow = styled(Box)`
	align-items: center;
	display: flex;
	justify-content: space-between;
	gap: ${spacing.small};
`;

export const RevenueDetailLabel = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.8125rem;
	font-weight: 700;
`;

export const RevenueDetailValue = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.8125rem;
	font-weight: 800;
	text-align: right;
`;

export const RevenueSkeleton = styled(Skeleton)`
	border-radius: ${spacing.xs};
`;
