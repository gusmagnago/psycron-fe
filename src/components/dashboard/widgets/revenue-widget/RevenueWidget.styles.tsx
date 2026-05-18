import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { dashboardAccents } from '@psycron/theme/palette/dashboardAccents';
import { palette } from '@psycron/theme/palette/palette.theme';
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
