import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonBase } from '@mui/material';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ViewToggleGroup = styled('div')`
	min-height: 40px;
	padding: ${spacing.xxs};
	display: inline-flex;
	gap: ${spacing.xxs};
	border-radius: 999px;
	background: ${palette.background.paper};
	box-shadow:
		inset 2px 2px 4px ${hexToRgba(palette.gray['04'], 0.18)},
		inset -2px -2px 4px ${hexToRgba(palette.white, 0.86)};
`;

export const ViewToggleButton = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	min-width: 76px;
	min-height: 32px;
	padding: 0 ${spacing.extraSmall};
	border: 0;
	border-radius: 999px;
	background: transparent;
	color: ${palette.text.secondary};
	font-size: 13px;
	font-weight: 800;
	box-shadow: none;
	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease,
		background 0.18s ease,
		color 0.18s ease;

	${({ isActive }) =>
		isActive &&
		css`
			color: ${palette.white};
			background: ${palette.brand.purple};
			box-shadow: ${shadowSmall};
		`}

	&:hover {
		transform: translateY(-1px);
		box-shadow: ${shadowSmall};
	}
`;
