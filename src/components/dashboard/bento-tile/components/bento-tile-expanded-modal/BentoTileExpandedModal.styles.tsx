import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { bentoTileTheme } from '@psycron/theme/dashboard/bentoTile.theme';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

import { glassTile } from '../../BentoTile.styles';

export const BentoTileModalPanel = styled(motion.div)`
	${glassTile}
	background: ${palette.background.default};
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) auto;
	gap: ${spacing.small};
	left: 50%;
	max-height: ${bentoTileTheme.size.modalMaxHeight};
	max-width: ${bentoTileTheme.size.modalMaxWidth};
	padding: ${spacing.medium};
	position: fixed;
	top: 50%;
	width: 100%;
	z-index: ${bentoTileTheme.elevation.overlay};
	pointer-events: auto;
`;

export const BentoTileModalFrame = styled(Box)`
	inset: ${spacing.none};
	pointer-events: none;
	position: fixed;
`;

export const BentoTileExpandedHeader = styled(Box)`
	align-items: center;
	display: flex;
	justify-content: space-between;
	min-width: 0;
`;

export const BentoTileExpandedBody = styled(Box)`
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
`;

export const BentoTileExpandedFooter = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	justify-content: space-between;
	min-height: ${bentoTileTheme.footer.minHeight};
`;
