import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexBase, zIndexPopover } from '@psycron/theme/zIndex';

export const DrawerBackdrop = styled(Box)`
	position: fixed;
	inset: 0;
	background: ${hexToRgba(palette.black, 0.2)};
	z-index: ${zIndexBase};
`;

export const DrawerPanel = styled(Box)`
	position: fixed;
	right: 0;
	top: 0;
	bottom: 0;
	width: 480px;
	background: ${palette.background.default};
	box-shadow: -10px 0 30px 0 ${hexToRgba(palette.gray['03'], 0.3)};
	z-index: ${zIndexPopover};
	overflow-y: auto;

	${isMobileMedia} {
		width: 100%;
	}
`;

export const DrawerContent = styled(Box)`
	padding: ${spacing.mediumLarge};

	${isMobileMedia} {
		padding: ${spacing.medium};
	}
`;
