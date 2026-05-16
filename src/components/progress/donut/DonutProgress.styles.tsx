import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowGlassShimmer } from '@psycron/theme/shadow/shadow.theme';
import { motion } from 'framer-motion';

import type { DonutProgressTone } from './DonutProgress.types';

const DONUT_SIZE = 'clamp(150px, 44%, 200px)';
const SHELL_RADIUS = '999px';
const TRACE_WIDTH = 7;
const TRACE_HOVER_WIDTH = 8;

const toneColor = (tone: DonutProgressTone): string => palette[tone].main;
const toneSurface = (tone: DonutProgressTone): string =>
	palette[tone].surface.light ?? palette[tone].light;
const progressGradient = (
	value: number
): { end: string; glow: string; start: string } => {
	if (value < 34) {
		return {
			end: palette.secondary.main,
			glow: palette.error.main,
			start: palette.error.main,
		};
	}

	if (value < 67) {
		return {
			end: palette.tertiary.main,
			glow: palette.warning.main,
			start: palette.warning.main,
		};
	}

	if (value < 90) {
		return {
			end: palette.warning.main,
			glow: palette.warning.main,
			start: palette.alert.main,
		};
	}

	return {
		end: palette.success.main,
		glow: palette.success.main,
		start: palette.info.main,
	};
};

const glassSurface = `
	radial-gradient(circle, ${hexToRgba(palette.white, 0.9)} 0%, ${hexToRgba(
		palette.primary.surface.light,
		0.7
	)} 58%, ${hexToRgba(palette.tertiary.light, 0.5)} 100%)
`;

export const DonutShell = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'progressValue' && prop !== 'tone',
})<{ progressValue: number; tone: DonutProgressTone }>`
	--donut-progress-color: ${({ tone }) => toneColor(tone)};
	--donut-gradient-start: ${({ progressValue }) =>
		progressGradient(progressValue).start};
	--donut-gradient-end: ${({ progressValue }) =>
		progressGradient(progressValue).end};
	--donut-progress-glow-color: ${({ progressValue }) =>
		progressGradient(progressValue).glow};
	align-items: center;
	aspect-ratio: 1;
	background:
		radial-gradient(circle, ${hexToRgba(palette.white, 0.44)} 0%, ${({
			tone,
		}) => toneSurface(tone)} 100%),
		${glassSurface};
	border: 1px solid ${hexToRgba(palette.white, 0.72)};
	border-radius: ${SHELL_RADIUS};
	box-shadow:
		0 12px 28px ${hexToRgba(palette.tertiary.main, 0.12)},
		${shadowGlassShimmer};
	display: grid;
	justify-items: center;
	max-width: 200px;
	min-width: 150px;
	place-self: center;
	position: relative;
	transform: translateY(0) scale(1);
	transition:
		box-shadow 0.24s ease,
		transform 0.24s ease;
	width: ${DONUT_SIZE};

	&:hover {
		box-shadow:
			0 14px 32px ${hexToRgba(palette.tertiary.main, 0.14)},
			${shadowGlassShimmer};
		transform: translateY(-2px) scale(1.02);
	}

	&:hover .donut-progress__fill {
		animation:
			donutTraceGlow 1.2s ease-in-out infinite alternate,
			donutTraceDrift 1.8s ease-in-out infinite alternate;
		filter: drop-shadow(0 0 4px var(--donut-progress-glow-color))
			drop-shadow(0 0 8px var(--donut-progress-glow-color));
		stroke-width: ${TRACE_HOVER_WIDTH};
	}

	&:hover .donut-progress__center {
		box-shadow:
			0 10px 22px ${hexToRgba(palette.black, 0.1)},
			${shadowGlassShimmer};
		transform: scale(1.04);
	}

	@keyframes donutTraceGlow {
		from {
			opacity: 0.84;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes donutTraceDrift {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(5deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		&,
		.donut-progress__center,
		.donut-progress__fill {
			animation: none;
			transition: none;
		}
	}
`;

export const DonutSvg = styled.svg`
	height: 100%;
	overflow: visible;
	transform: rotate(-90deg);
	width: 100%;
`;

export const DonutTrack = styled.circle`
	fill: none;
	stroke: ${hexToRgba(palette.white, 0.88)};
	stroke-linecap: round;
	stroke-width: ${TRACE_WIDTH};
`;

export const DonutFill = styled(motion.circle)`
	fill: none;
	transform-box: fill-box;
	transform-origin: center;
	stroke-linecap: round;
	stroke-width: ${TRACE_WIDTH};
	transition:
		filter 0.24s ease,
		opacity 0.24s ease,
		stroke-width 0.24s ease;
`;

export const DonutCenter = styled(Box)`
	align-items: center;
	aspect-ratio: 1;
	background:
		radial-gradient(
			circle,
			${hexToRgba(palette.white, 0.8)} 0%,
			${hexToRgba(palette.white, 0.48)} 100%
		);
	backdrop-filter: blur(14px) saturate(145%);
	border: 1px solid ${hexToRgba(palette.white, 0.52)};
	border-radius: ${SHELL_RADIUS};
	box-shadow:
		inset 0 1px 0 ${hexToRgba(palette.white, 0.72)},
		0 8px 18px ${hexToRgba(palette.tertiary.main, 0.08)};
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-width: 100px;
	padding: 12px;
	position: absolute;
	text-align: center;
	transform: scale(1);
	transition:
		box-shadow 0.24s ease,
		transform 0.24s ease;
	width: 68%;
	z-index: 1;
`;

export const DonutValue = styled(motion.span)`
	color: ${palette.text.primary};
	font-size: 26px;
	font-weight: 800;
	line-height: 1;
`;

export const DonutMeta = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 10px;
	font-weight: 700;
	line-height: 1.3;
	margin-top: 3px;
	white-space: nowrap;
`;
