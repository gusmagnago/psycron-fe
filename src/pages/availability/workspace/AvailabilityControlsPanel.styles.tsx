import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, ButtonBase } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const WorkspaceToggleRow = styled(Box)`
	min-height: 62px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.extraSmall};
	padding: ${spacing.extraSmall};
	border-radius: 18px;
	background: ${hexToRgba(palette.background.default, 0.76)};
`;

export const WorkspaceToggleTitle = styled(Text)`
	display: flex;
	font-size: 14px;
	line-height: 1.25;
	font-weight: 800;
	color: ${palette.text.primary};
`;

export const WorkspaceToggleDescription = styled(Text)`
	display: flex;
	margin-top: 3px;
	color: ${palette.text.secondary};
	font-size: 12px;
	line-height: 1.35;
`;

export const WorkspaceSwitch = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'isChecked',
})<{ isChecked: boolean }>`
	width: 54px;
	min-width: 54px;
	min-height: 32px;
	padding: ${spacing.space};
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: flex-start;
	background: ${palette.gray['02']};
	box-shadow: ${shadowSmall};
	transition:
		background 0.18s ease,
		justify-content 0.18s ease;

	&::after {
		content: '';
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: ${palette.white};
		box-shadow: 0 1px 2px ${hexToRgba(palette.black, 0.16)};
	}

	${({ isChecked }) =>
		isChecked &&
		css`
			justify-content: flex-end;
			background: ${palette.brand.purple};
		`}
`;

export const JupiterNudge = styled(Box)`
	display: grid;
	grid-template-columns: 44px minmax(0, 1fr);
	gap: ${spacing.extraSmall};
	padding: ${spacing.small};
	border-radius: ${spacing.mediumSmall};
	background: linear-gradient(
		135deg,
		${hexToRgba(palette.brand.purple, 0.1)},
		${hexToRgba(palette.white, 0.78)}
	);
`;

export const JupiterIconFrame = styled(Box)`
	width: 44px;
	height: 44px;
	border-radius: 17px;
	display: grid;
	place-items: center;
	color: ${palette.white};
	background: ${palette.brand.purple};
	box-shadow: ${shadowMedium};

	@media (prefers-reduced-motion: no-preference) {
		animation: jupiter-float 4s ease-in-out infinite;
	}

	@keyframes jupiter-float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}
`;

export const JupiterEyebrow = styled(Text)`
	display: block;
	margin-bottom: ${spacing.space};
	color: ${palette.brand.dark};
	font-size: 12px;
	font-weight: 800;
	letter-spacing: 0.04em;
`;

export const JupiterMessage = styled(Text)`
	display: block;
	margin: 0;
	color: ${palette.text.secondary};
	font-size: 13px;
	line-height: 1.45;
`;
