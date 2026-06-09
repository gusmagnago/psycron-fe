import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { palette } from '@psycron/theme/palette/palette.theme';
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

export const RevenueDataState = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xxs};
	justify-content: center;
	min-width: 0;
`;

export const RevenueAmount = styled(Text)`
	color: ${palette.text.primary};
	font-size: 2.25rem;
	font-weight: 800;
	letter-spacing: 0;
	line-height: 1;
`;

export const RevenueSubline = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.875rem;
	font-weight: 650;
	line-height: 1.35;
`;

export const RevenueEmpty = styled(Box)`
	align-items: center;
	background: ${palette.white};
	border: 0;
	border-radius: ${spacing.medium};
	box-shadow: ${shadowDashboardTile};
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xxs};
	justify-content: center;
	min-height: 0;
	width: 100%;
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
	height: 2.75rem;
	justify-content: center;
	width: 2.75rem;
`;

export const RevenueEmptyIconGlyph = styled(Box)`
	align-items: center;
	display: inline-flex;
	font-size: 1.1rem;
	font-weight: 900;
	justify-content: center;
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
	max-width: 15rem;
`;

export const RevenueEmptyButton = styled(Button)`
	margin-top: ${spacing.xxs};
	min-width: 9.5rem;
`;

export const RevenueSkeleton = styled(Skeleton)`
	border-radius: ${spacing.xs};
`;
