import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
import {
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMedium,
	shadowMediumPurple,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexBase, zIndexDrawer } from '@psycron/theme/zIndex';

import type { AvailabilityWorkspaceContentMode } from './AvailabilityWorkspaceShell.types';

export const WorkspaceRoot = styled(Box)`
	height: 100%;
	min-height: 0;
	padding: max(${spacing.xs}, env(safe-area-inset-top))
		max(${spacing.xs}, env(safe-area-inset-right))
		max(${spacing.xs}, env(safe-area-inset-bottom))
		max(${spacing.xs}, env(safe-area-inset-left));
	background: ${palette.background.default};
`;

export const SkipLink = styled('a')`
	position: fixed;
	left: ${spacing.small};
	top: ${spacing.small};
	z-index: ${zIndexDrawer + 3};
	transform: translateY(-180%);
	border-radius: 999px;
	padding: 10px ${spacing.small};
	color: ${palette.white};
	background: ${palette.brand.purple};
	box-shadow: ${shadowMedium};
	font-weight: 800;
	text-decoration: none;

	&:focus {
		transform: translateY(0);
	}
`;

export const WorkspaceFrame = styled(Box)`
	width: min(1800px, 100%);
	height: 100%;
	min-height: 0;
	margin: 0 auto;
	position: relative;
	display: flex;
	align-items: stretch;
`;

export const WorkspaceMain = styled(Box)`
	flex: 1 1 auto;
	min-width: 0;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
	border-radius: ${spacing.medium};
	background:
		linear-gradient(
			135deg,
			${hexToRgba(palette.white, 0.74)},
			${hexToRgba(palette.white, 0.42)}
		),
		${hexToRgba(palette.white, 0.68)};
	border: 1px solid ${hexToRgba(palette.white, 0.58)};
	backdrop-filter: blur(18px) saturate(1.24);
	-webkit-backdrop-filter: blur(18px) saturate(1.24);
	box-shadow: ${shadowSmall};
`;

export const WorkspaceMainContent = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'contentMode',
})<{ contentMode: AvailabilityWorkspaceContentMode }>`
	flex: 1 1 auto;
	min-height: 0;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	${({ contentMode }) =>
		contentMode === 'page' &&
		css`
			overflow: auto;
			padding: ${spacing.medium};

			${isMobileMedia} {
				padding: ${spacing.small};
			}
		`}

	${({ contentMode }) =>
		contentMode === 'chat' &&
		css`
			position: relative;
		`}
`;

export const WorkspaceLoaderRegion = styled(Box)`
	flex: 1;
	min-height: 20rem;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const WorkspaceScrim = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'isVisible',
})<{ isVisible: boolean }>`
	display: none;
	position: fixed;
	inset: 0;
	z-index: ${zIndexDrawer - 2};
	background: ${hexToRgba(palette.black, 0.2)};
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.12s ease;

	${isSmallerThanTabletMedia} {
		display: block;
		opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
		pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
	}
`;

export const WorkspaceEdgeToggle = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'isOwnPanelOpen',
})<{
	isOwnPanelOpen: boolean;
}>`
	position: absolute;
	top: ${spacing.medium};
	right: 0;
	/* Just above page content, below all sticky chrome and drawers. */
	z-index: ${zIndexBase};
	width: 38px;
	height: 64px;
	border: 0;
	border-radius: ${spacing.small} 0 0 ${spacing.small};
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: ${palette.gray['08']};
	background: ${palette.white};
	box-shadow: ${shadowSmall};
	transition:
		transform 0.12s ease,
		opacity 0.1s ease,
		color 0.12s ease,
		box-shadow 0.12s ease;

	${({ isOwnPanelOpen }) =>
		isOwnPanelOpen &&
		css`
			opacity: 0;
			pointer-events: none;
			transform: translateX(100%);
		`}

	&:hover {
		color: ${palette.brand.dark};
		box-shadow: ${shadowMediumPurple};
	}

	${isSmallerThanTabletMedia} {
		top: 84px;
	}
`;
