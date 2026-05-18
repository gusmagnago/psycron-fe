import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export const LummiHeroWrapper = styled(motion.div, {
	shouldForwardProp: (prop) => prop !== 'size',
})<{ size: number }>`
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	filter: drop-shadow(0 8px 24px rgba(6, 11, 14, 0.12));
`;

export const LummiImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: contain;
	border-radius: 12px;
`;

export const FallbackIconWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'size',
})<{ size: number }>`
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	display: flex;
	align-items: center;
	justify-content: center;
`;
