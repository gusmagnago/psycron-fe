import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const CollapsibleWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const ToggleHeader = styled('button')`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	width: 100%;
	padding: 0;
	background: none;
	border: none;
	cursor: pointer;
	text-align: left;

	& svg {
		width: 14px;
		height: 14px;
	}
`;

export const ChevronWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
	margin-left: auto;
	display: flex;
	align-items: center;
	transition: transform 0.2s ease;
	transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
`;

export const MotionCollapse = styled(motion.div)`
	overflow: hidden;
`;

export const CollapsibleContent = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;
