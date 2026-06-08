import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { glassTile } from '@psycron/components/dashboard/bento-tile/BentoTile.styles';
import {
	isBiggerThanMediumMedia,
	isBiggerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const DashboardRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	flex: 1;
	gap: ${spacing.mediumSmall};
	margin: 0 auto;
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
	width: 100%;
	height: 100%;
	position: relative;
	padding: ${spacing.small} ${spacing.mediumSmall} ${spacing.large};
`;

export const DashboardHeader = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};
	justify-content: space-between;
	padding: 0 ${spacing.xs};
`;

export const DashboardTopBar = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
	gap: ${spacing.small};
	padding: 0 ${spacing.xs};

	position: absolute;
	top: 0;
	left: 0;
`;

export const DashboardSections = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.mediumSmall};
	min-height: 0;
`;

export const DashboardSection = styled('section')`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	min-width: 0;
`;

export const DashboardSectionLabel = styled('h2')`
	align-items: center;
	color: ${palette.gray['05']};
	display: flex;
	font-size: 0.71875rem;
	font-weight: 700;
	gap: ${spacing.xs};
	letter-spacing: 0.07em;
	line-height: 1.2;
	margin: ${spacing.xs} ${spacing.space} ${spacing.xxs};
	text-transform: uppercase;

	&::after {
		background: ${palette.gray['01']};
		content: '';
		flex: 1;
		height: 1px;
	}
`;

export const DragOverlayCard = styled(Box)`
	${glassTile}
	height: 100%;
	width: 100%;
	cursor: grabbing;
	transform: scale(1.03) rotate(1deg);
	opacity: 0.9;
`;

export const BentoGridWrapper = styled(Box)`
	position: relative;
	height: 100%;
`;

export const BentoGrid = styled(Box)`
	display: grid;
	grid-template-columns: 1fr;
	gap: ${spacing.small};
	grid-auto-rows: auto;
	height: auto;

	${isBiggerThanTabletMedia} {
		grid-template-columns: repeat(6, minmax(0, 1fr));
		grid-auto-rows: 70px;
		align-content: start;
		height: auto;
	}

	${isBiggerThanMediumMedia} {
		grid-template-columns: repeat(12, minmax(0, 1fr));
		grid-auto-rows: 70px;
	}
`;
