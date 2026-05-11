import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { glassTile } from '@psycron/components/dashboard/bento-tile/BentoTile.styles';
import {
	isBiggerThanMediumMedia,
	isBiggerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const DashboardRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	flex: 1;
	gap: ${spacing.small};
	margin: 0 auto;
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
	width: 100%;
	height: 100%;
`;

export const DashboardTopBar = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: ${spacing.small};
`;

export const DragOverlayCard = styled(Box)`
	${glassTile}
	height: 100%;
	width: 100%;
	cursor: grabbing;
	transform: scale(1.03) rotate(1deg);
	opacity: 0.9;
`;

export const BentoGrid = styled(Box)`
	display: grid;
	grid-template-columns: 1fr;
	gap: ${spacing.small};
	grid-auto-rows: auto;
	padding: ${spacing.xs};
	padding-top: 0;

	${isBiggerThanTabletMedia} {
		grid-template-columns: repeat(6, 1fr);
		gap: ${spacing.mediumSmall};
	}

	${isBiggerThanMediumMedia} {
		grid-template-columns: repeat(12, 1fr);
	}
`;
