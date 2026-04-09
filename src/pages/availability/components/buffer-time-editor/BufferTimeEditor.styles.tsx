import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const BufferEditorWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const BufferOptionChips = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const BufferOptionChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	padding: ${spacing.xs} ${spacing.small};
	border-radius: ${spacing.small};
	border: 1.5px solid
		${({ isSelected }) =>
			isSelected ? palette.brand.purple : palette.gray['02']};
	background: ${({ isSelected }) =>
		isSelected ? hexToRgba(palette.brand.purple, 0.08) : 'transparent'};
	color: ${({ isSelected }) =>
		isSelected ? palette.brand.purple : palette.text.primary};
	font-size: 14px;
	font-weight: ${({ isSelected }) => (isSelected ? 600 : 400)};
	cursor: pointer;
	user-select: none;
	transition: all 0.15s ease;

	&:hover {
		border-color: ${palette.brand.purple};
		background: ${hexToRgba(palette.brand.purple, 0.05)};
	}
`;

export const BufferHelper = styled(Text)`
	font-size: 13px;
	color: ${palette.text.secondary};
	line-height: 1.5;
	text-align: left;
`;

export const BufferPanel = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'severity',
})<{ severity?: 'info' | 'soft' | 'strong' }>`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.small};
	border-radius: ${spacing.small};
	border: 1px solid
		${({ severity }) =>
			severity === 'strong'
				? hexToRgba(palette.warning.main, 0.45)
				: severity === 'soft'
					? hexToRgba(palette.alert.main, 0.3)
					: hexToRgba(palette.brand.purple, 0.18)};
	background: ${({ severity }) =>
		severity === 'strong'
			? hexToRgba(palette.warning.main, 0.08)
			: severity === 'soft'
				? hexToRgba(palette.alert.main, 0.08)
				: hexToRgba(palette.brand.purple, 0.05)};
`;

export const BufferPanelTitle = styled(Text)`
	font-size: 12px;
	font-weight: 600;
	color: ${palette.text.primary};
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

export const BufferPanelText = styled(Text)`
	font-size: 13px;
	color: ${palette.text.secondary};
	line-height: 1.5;
	text-align: left;
`;

export const BufferThinkingRow = styled('span')`
	display: inline-flex;
	align-items: flex-end;
`;

export const BufferThinkingDots = styled('span')`
	display: inline-flex;
	align-items: flex-end;
	gap: 4px;
	padding-left: ${spacing.xxs};

	span {
		width: 5px;
		height: 5px;
		border-radius: 999px;
		background: ${palette.brand.purple};
		opacity: 0.35;
		animation: bufferThinkingPulse 1.1s ease-in-out infinite;
	}

	span:nth-of-type(2) {
		animation-delay: 0.14s;
	}

	span:nth-of-type(3) {
		animation-delay: 0.28s;
	}

	@keyframes bufferThinkingPulse {
		0%,
		80%,
		100% {
			opacity: 0.25;
			transform: translateY(0);
		}

		40% {
			opacity: 1;
			transform: translateY(-1px);
		}
	}
`;
