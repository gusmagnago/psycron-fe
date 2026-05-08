import styled from '@emotion/styled';
import { Box } from '@mui/material';
import {
	isBiggerThanMediumMedia,
	isBiggerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const DashboardRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	max-width: 1600px;
	margin: 0 auto;
	width: 100%;
`;

export const DashboardTopBar = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: ${spacing.small};
`;

export const BentoGrid = styled(Box)`
	display: grid;
	grid-template-columns: 1fr;
	gap: ${spacing.small};
	grid-auto-rows: auto;
	${isBiggerThanTabletMedia} {
		grid-template-columns: repeat(6, 1fr);
		gap: ${spacing.mediumSmall};
	}

	${isBiggerThanMediumMedia} {
		grid-template-columns: repeat(12, 1fr);
	}
`;
