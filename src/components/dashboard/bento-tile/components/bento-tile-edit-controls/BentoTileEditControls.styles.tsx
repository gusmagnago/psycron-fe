import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { bentoTileTheme } from '@psycron/theme/dashboard/bentoTile.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BentoTileControls = styled(Box)`
	position: absolute;
	top: ${spacing.small};
	right: ${spacing.small};
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	z-index: ${bentoTileTheme.elevation.chrome};
	background: ${bentoTileTheme.color.lightBackground};
	border-radius: ${bentoTileTheme.radius.controlL};
	backdrop-filter: blur(${bentoTileTheme.backdrop.blur});

	& svg {
		height: ${spacing.small};
		width: ${spacing.small};
	}
`;

export const ResizeControls = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${bentoTileTheme.space.controlPairGap};
`;

export const DragHandle = styled(Box)`
	cursor: grab;
	color: ${bentoTileTheme.color.control};
	font-size: ${bentoTileTheme.size.dragHandleFont};
	line-height: 1;
	user-select: none;
	padding: ${bentoTileTheme.space.controlInset} ${spacing.xxs};
	border-radius: ${bentoTileTheme.radius.control};
	transition: ${bentoTileTheme.motion.colorTransition};

	&:hover {
		color: ${bentoTileTheme.color.controlHover};
	}

	&:active {
		cursor: grabbing;
	}
`;
