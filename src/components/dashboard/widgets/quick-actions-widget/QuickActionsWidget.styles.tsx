import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const ActionsList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const ActionButton = styled(motion.button, {
	shouldForwardProp: (prop) => prop !== 'hasBadge',
})<{ hasBadge?: boolean }>`
	all: unset;
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.small} ${spacing.extraSmall};
	border-radius: ${spacing.extraSmall};
	border: 1px solid ${palette.gray['02']};
	background: transparent;
	cursor: pointer;
	transition:
		background 0.15s ease,
		border-color 0.15s ease;
	position: relative;

	&:hover {
		background: ${palette.primary.surface.light};
		border-color: ${palette.primary.main};
	}

	&:hover [data-chevron] {
		opacity: 0.65;
		transform: translateX(2px);
	}

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 2px;
	}
`;

export const ActionLabel = styled(Text)`
	font-size: 14px;
	font-weight: 500;
	color: ${palette.text.primary};
	flex: 1;
	text-align: left;
`;

export const ActionIconWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'iconBg' && prop !== 'iconFg',
})<{ iconBg: string; iconFg: string }>`
	width: ${spacing.large};
	height: ${spacing.large};
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: ${spacing.xs};
	background: ${({ iconBg }) => iconBg};
	color: ${({ iconFg }) => iconFg};
	flex-shrink: 0;
`;

export const ActionChevron = styled(Box)`
	display: flex;
	align-items: center;
	color: ${palette.text.secondary};
	opacity: 0.35;
	flex-shrink: 0;
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
`;

export const Badge = styled(Box)`
	background: ${palette.alert.main};
	color: ${palette.white};
	font-size: 11px;
	font-weight: 700;
	border-radius: 99px;
	min-width: 18px;
	height: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 ${spacing.space};
`;
