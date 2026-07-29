import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexDrawer } from '@psycron/theme/zIndex';

export const DrawerBackdrop = styled(Box)`
	position: fixed;
	inset: 0;
	background: ${hexToRgba(palette.black, 0.2)};
	z-index: ${zIndexDrawer - 1};
`;

export const DrawerPanel = styled(Box)`
	position: fixed;
	right: 0;
	top: 0;
	bottom: 0;
	width: 480px;
	background: ${palette.background.default};
	box-shadow: -10px 0 30px 0 ${hexToRgba(palette.gray['03'], 0.3)};
	z-index: ${zIndexDrawer};
	display: flex;
	flex-direction: column;
	overflow: hidden;

	${isSmallerThanTabletMedia} {
		width: 100%;
	}
`;

export const DrawerContent = styled(Box)`
	flex: 1;
	overflow-y: auto;
	padding: 0 ${spacing.mediumLarge} ${spacing.mediumLarge};

	${isMobileMedia} {
		padding: 0 ${spacing.medium} ${spacing.medium};
	}
`;

// ─── Canonical header / title / actions ───────────────────────────────────────

export const DrawerHeader = styled(Box)`
	display: flex;
	align-items: flex-start;
	flex-shrink: 0;
	justify-content: space-between;
	padding: ${spacing.mediumLarge} ${spacing.mediumLarge} ${spacing.medium};

	&& > button {
		height: 44px;
		min-height: 44px;
		min-width: 44px;
		width: 44px;
	}

	${isMobileMedia} {
		padding: ${spacing.small} ${spacing.small} ${spacing.xs};
	}
`;

export const DrawerTitle = styled((props) => <Text component='div' {...props} />)`
	font-size: 20px;
	font-weight: 600;
	color: ${palette.text.primary};
	margin-bottom: ${spacing.xxs};
`;

export const DrawerActions = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	margin-top: auto;
	padding-top: ${spacing.medium};
`;

export const DrawerActionsSection = styled(Box)`
	flex-shrink: 0;
	padding: ${spacing.medium} ${spacing.mediumLarge} ${spacing.large};

	${isMobileMedia} {
		padding: ${spacing.small} ${spacing.medium} ${spacing.medium};
	}
`;

// ─── Generic drawer body / description ────────────────────────────────────────

export const DrawerBody = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	flex: 1;
`;

export const DrawerDesc = styled(Text)`
	font-size: 14px;
	color: ${palette.text.secondary};
	line-height: 1.55;
`;
