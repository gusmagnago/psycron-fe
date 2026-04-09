import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
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

// ─── Canonical header / title / actions ───────────────────────────────────────

export const DrawerHeader = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: ${spacing.large};
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
	padding-top: ${spacing.medium};
	padding-bottom: ${spacing.large};
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
