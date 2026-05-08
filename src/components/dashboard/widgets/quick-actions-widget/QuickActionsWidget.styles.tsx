import styled from '@emotion/styled';
import { Box } from '@mui/material';
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
	padding: ${spacing.xs} ${spacing.extraSmall};
	border-radius: 12px;
	border: 1px solid ${palette.gray['02']};
	background: transparent;
	cursor: pointer;
	transition: background 0.15s ease, border-color 0.15s ease;
	position: relative;

	&:hover {
		background: ${palette.primary.surface.light};
		border-color: ${palette.primary.main};
	}

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 2px;
	}
`;

export const ActionLabel = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: ${palette.text.primary};
	flex: 1;
`;

export const ActionIconWrapper = styled(Box)`
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	background: ${palette.primary.surface.light};
	color: ${palette.primary.dark};
	flex-shrink: 0;
`;

export const Badge = styled(Box)`
	background: ${palette.alert.main};
	color: #fff;
	font-size: 11px;
	font-weight: 700;
	border-radius: 99px;
	min-width: 18px;
	height: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 5px;
`;
