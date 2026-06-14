import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isSmallerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowDashboardTile,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexDrawer } from '@psycron/theme/zIndex';

export const WorkspacePanelRoot = styled('aside', {
	shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
	flex: 0 0 auto;
	width: 0;
	min-width: 0;
	height: 100%;
	overflow: hidden;
	opacity: 0;
	pointer-events: none;
	display: flex;
	flex-direction: column;
	position: relative;
	border-radius: ${spacing.medium};
	background:
		linear-gradient(
			135deg,
			${hexToRgba(palette.white, 0.74)},
			${hexToRgba(palette.white, 0.42)}
		),
		radial-gradient(
			circle at 20% 0%,
			${hexToRgba(palette.brand.purple, 0.12)},
			transparent 34%
		),
		${hexToRgba(palette.white, 0.5)};
	border: 1px solid ${hexToRgba(palette.white, 0.58)};
	backdrop-filter: blur(18px) saturate(1.24);
	-webkit-backdrop-filter: blur(18px) saturate(1.24);
	box-shadow: ${shadowSmall};
	transition:
		width 0.12s cubic-bezier(0.2, 0.8, 0.2, 1),
		margin 0.12s cubic-bezier(0.2, 0.8, 0.2, 1),
		opacity 0.08s ease;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background:
			radial-gradient(
				circle at 18% 14%,
				${hexToRgba(palette.white, 0.55)},
				transparent 18%
			),
			linear-gradient(
				120deg,
				transparent 0%,
				${hexToRgba(palette.white, 0.28)} 24%,
				transparent 44%
			);
		opacity: 0.72;
		pointer-events: none;
		mix-blend-mode: screen;
	}

	& > * {
		position: relative;
		z-index: 1;
	}

	${({ isOpen }) =>
		isOpen &&
		css`
			width: 320px;
			margin-left: ${spacing.xs};
			margin-right: 0;
			opacity: 1;
			pointer-events: auto;
		`}

	${isSmallerThanTabletMedia} {
		position: fixed;
		top: 0;
		right: 0;
		height: 100dvh;
		width: min(480px, 100vw);
		margin: 0;
		border-radius: 0;
		background: ${palette.white};
		z-index: ${zIndexDrawer - 1};
		transform: translateX(100%);
		box-shadow: -10px 0 30px 0 ${hexToRgba(palette.black, 0.2)};
		transition:
			transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.08s ease;

		${({ isOpen }) =>
			isOpen &&
			css`
				transform: translateX(0);
			`}
	}
`;

export const WorkspacePanelHeader = styled(Box)`
	min-height: 68px;
	padding: ${spacing.mediumSmall};
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.extraSmall};
	border-bottom: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};
`;

export const WorkspacePanelTitle = styled((props) => (
	<Text component='h2' {...props} />
))`
	margin: 0;
	font-size: 17px;
	line-height: 1.2;
	letter-spacing: 0;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const WorkspacePanelClose = styled(ButtonBase)`
	width: 44px;
	height: 44px;
	min-width: 44px;
	min-height: 44px;
	color: ${palette.gray['08']};
	background: ${palette.background.default};
	border-radius: 999px;
	box-shadow: ${shadowDashboardTile};
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease,
		color 0.18s ease;

	&:hover {
		color: ${palette.brand.dark};
		transform: translateY(-1px);
	}
`;

export const WorkspacePanelBody = styled(Box)`
	flex: 1 1 auto;
	min-height: 0;
	padding: ${spacing.mediumSmall};
	overflow: auto;
	display: flex;
	flex-direction: column;
	gap: ${spacing.mediumSmall};
`;
