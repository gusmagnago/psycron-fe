import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ReadinessCard = styled(Box)`
	padding: ${spacing.small};
	border-radius: 18px;
	background: ${hexToRgba(palette.background.default, 0.78)};
`;

export const ReadinessTitle = styled((props) => (
	<Text component='h3' {...props} />
))`
	margin: 0 0 ${spacing.extraSmall};
	font-size: 14px;
	font-weight: 800;
	color: ${palette.text.primary};
`;

export const ReadinessCheck = styled(Box)`
	min-height: 44px;
	display: grid;
	grid-template-columns: 24px minmax(0, 1fr);
	align-items: center;
	gap: ${spacing.xs};
	color: ${palette.text.secondary};
	font-size: 13px;
	line-height: 1.35;
`;

export const ReadinessCheckIcon = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isWarning',
})<{ isWarning?: boolean }>`
	width: 22px;
	height: 22px;
	border-radius: 50%;
	display: grid;
	place-items: center;
	color: ${({ isWarning }) =>
		isWarning ? palette.warning.dark : palette.success.dark};
	background: ${({ isWarning }) =>
		isWarning ? palette.warning.surface.press : palette.success.surface.hover};

	& svg {
		width: 14px;
		height: 14px;
	}
`;

export const ReadinessNote = styled(Box)`
	padding: ${spacing.extraSmall};
	border-radius: ${spacing.small};
	color: ${palette.text.secondary};
	background: ${palette.success.surface.light};
	font-size: 12px;
	line-height: 1.4;
`;

export const ReadinessActions = styled(Box)`
	margin-top: auto;
	padding-top: ${spacing.mediumSmall};
	display: flex;
	flex-direction: column;
	gap: ${spacing.extraSmall};
`;

export const ReadinessJupiterAnswer = styled(ReadinessCard)`
	color: ${palette.brand.dark};
	background: ${palette.brand.light};
`;

export const ReadinessBody = styled(Text)`
	display: block;
	color: ${palette.text.secondary};
	font-size: 13px;
	line-height: 1.5;
`;
