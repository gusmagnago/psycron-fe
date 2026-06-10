import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const cloudDrift = keyframes`
	0%, 100% { transform: translateX(-4px); }
	50%       { transform: translateX(4px);  }
`;

const rainFall = keyframes`
	0%   { transform: translateY(0);   opacity: 0; }
	30%  {                              opacity: 1; }
	100% { transform: translateY(7px); opacity: 0; }
`;

const raysSpin = keyframes`
	to { transform: rotate(360deg); }
`;

const twinkle = keyframes`
	0%, 100% { opacity: .25; }
	50%      { opacity: 1;   }
`;

export const cloudDriftCss = css`
	animation: ${cloudDrift} 7s ease-in-out infinite;
`;

export const rainFallCss = (delay: number) => css`
	animation: ${rainFall} 1.1s linear ${delay}s infinite;
`;

export const raysSpinCss = css`
	animation: ${raysSpin} 26s linear infinite;
	transform-origin: 32px 32px;
`;

export const twinkleCss = (delay = 0) => css`
	animation: ${twinkle} 3s ease-in-out ${delay}s infinite;
`;

export const LummiHeroWrapper = styled(motion.div, {
	shouldForwardProp: (prop) => prop !== 'size',
})<{ size: number }>`
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	position: relative;
`;

export const GlowRing = styled(motion.span, {
	shouldForwardProp: (prop) => prop !== 'glowColor',
})<{ glowColor: string }>`
	position: absolute;
	inset: -14px;
	border-radius: 50%;
	background: radial-gradient(circle, ${({ glowColor }) => glowColor} 0%, transparent 70%);
	pointer-events: none;
	z-index: 0;
`;

export const LummiImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: contain;
	border-radius: 12px;
	position: relative;
	z-index: 1;
`;

export const FallbackIconWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'size',
})<{ size: number }>`
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	z-index: 1;
`;
