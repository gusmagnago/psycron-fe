import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { AvailabilityStatusTone } from './AvailabilityStatusStrip.types';

export const WorkspaceSectionLabel = styled((props) => (
	<Text component='p' {...props} />
))`
	margin: 0 0 ${spacing.xs};
	color: ${hexToRgba(palette.black, 0.6)};
	font-size: 12px;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const StatusList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const StatusLine = styled(Box)`
	min-height: 58px;
	display: grid;
	grid-template-columns: 34px minmax(0, 1fr) auto;
	gap: ${spacing.extraSmall};
	align-items: center;
	padding: ${spacing.extraSmall};
	border-radius: 18px;
	background: ${hexToRgba(palette.background.default, 0.76)};
`;

export const StatusMark = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: AvailabilityStatusTone }>`
	width: 34px;
	height: 34px;
	border-radius: 14px;
	display: grid;
	place-items: center;
	color: ${palette.brand.purple};
	background: ${palette.brand.light};

	${({ tone }) =>
		tone === 'success' &&
		css`
			color: ${palette.success.dark};
			background: ${palette.success.surface.hover};
		`}

	${({ tone }) =>
		tone === 'warn' &&
		css`
			color: ${palette.warning.dark};
			background: ${palette.warning.surface.press};
		`}

	${({ tone }) =>
		tone === 'google' &&
		css`
			color: ${palette.brand.google};
			background: ${hexToRgba(palette.brand.google, 0.1)};
		`}
`;

export const StatusTitle = styled(Text)`
	display: flex;
	font-size: 14px;
	line-height: 1.25;
	font-weight: 800;
	color: ${palette.text.primary};
`;

export const StatusDescription = styled(Text)`
	display: flex;
	margin-top: 3px;
	color: ${palette.text.secondary};
	font-size: 12px;
	line-height: 1.35;
`;

export const StatusBadge = styled(Text, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: AvailabilityStatusTone }>`
	min-width: 26px;
	height: 24px;
	padding: 0 ${spacing.xs};
	border-radius: 999px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${palette.brand.dark};
	background: ${palette.brand.light};
	font-size: 12px;
	font-weight: 800;

	${({ tone }) =>
		tone === 'warn' &&
		css`
			color: ${palette.error.dark};
			background: ${palette.error.access};
		`}
`;
