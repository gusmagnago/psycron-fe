import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const CarouselRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	height: 100%;
`;

export const CarouselViewport = styled(Box)`
	overflow: hidden;
	flex: 1;
	position: relative;
	min-height: 80px;
`;

export const CarouselSlide = styled(motion.div)`
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const JupiterHeader = styled(Box)`
	display: flex;
	align-items: center;
	gap: 8px;
	flex-shrink: 0;
`;

export const JupiterBadgeRow = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

export const JupiterCategory = styled.span`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: ${palette.tertiary.dark};
`;

export const JupiterDot = styled.span`
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: ${palette.tertiary.main};
	flex-shrink: 0;
`;

export const JupiterSubtitle = styled.span`
	font-size: 12px;
	color: ${palette.text.secondary};
`;

export const InsightTitle = styled.h3`
	margin: 0;
	font-size: 15px;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const InsightText = styled.p`
	margin: 0;
	font-size: 14px;
	line-height: 1.65;
	color: ${palette.text.primary};
	flex: 1;
`;

export const InsightActions = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	flex-wrap: wrap;
	flex-shrink: 0;
`;

export const CarouselFooter = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.xs};
	flex-shrink: 0;
`;

export const DotsRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: 6px;
`;

export const Dot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	width: ${({ isActive }) => (isActive ? '20px' : '6px')};
	height: 6px;
	border-radius: 99px;
	background: ${({ isActive }) =>
		isActive ? palette.tertiary.main : 'rgba(106, 81, 180, 0.3)'};
	transition:
		width 0.25s ease,
		background 0.25s ease;
	cursor: pointer;
`;

export const CarouselNav = styled(Box)`
	display: flex;
	gap: ${spacing.xxs};
`;

export const NavButton = styled.button`
	background: rgba(255, 255, 255, 0.5);
	border: 1px solid rgba(191, 167, 255, 0.3);
	border-radius: 8px;
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: ${palette.tertiary.dark};
	transition:
		background 0.15s ease,
		color 0.15s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.8);
	}

	&:focus-visible {
		outline: 2px solid ${palette.tertiary.main};
		outline-offset: 2px;
	}
`;

export const PrimaryAction = styled.button`
	all: unset;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	background: ${palette.tertiary.dark};
	color: #fff;
	font-size: 13px;
	font-weight: 600;
	padding: 8px 16px;
	border-radius: 99px;
	cursor: pointer;
	transition: opacity 0.15s ease;

	&:hover {
		opacity: 0.85;
	}

	&:focus-visible {
		outline: 2px solid ${palette.tertiary.dark};
		outline-offset: 2px;
	}
`;

export const SecondaryAction = styled.button`
	all: unset;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	background: rgba(255, 255, 255, 0.6);
	color: ${palette.text.primary};
	font-size: 13px;
	font-weight: 500;
	padding: 8px 16px;
	border-radius: 99px;
	cursor: pointer;
	border: 1px solid rgba(255, 255, 255, 0.8);
	transition: background 0.15s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.85);
	}

	&:focus-visible {
		outline: 2px solid ${palette.tertiary.main};
		outline-offset: 2px;
	}
`;

export const MicButton = styled.button`
	all: unset;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.5);
	border: 1px solid rgba(255, 255, 255, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: ${palette.text.secondary};
	transition: background 0.15s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.85);
	}

	&:focus-visible {
		outline: 2px solid ${palette.tertiary.main};
		outline-offset: 2px;
	}
`;
