import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';

export const DonutGlassFrame = styled(Box)`
	position: relative;
	display: grid;
	place-items: center;
	isolation: isolate;
	perspective: 800px;

	--donut-rx: 0deg;
	--donut-ry: 0deg;
	--donut-sx: 0px;
	--donut-sy: 0px;

	& > * {
		transition: transform 360ms cubic-bezier(0.2, 0.7, 0.2, 1);
		transform: rotateX(var(--donut-rx)) rotateY(var(--donut-ry));
	}

	@media (prefers-reduced-motion: reduce) {
		& > * {
			transition: none;
			transform: none;
		}
	}
`;

export const DonutGlassDisc = styled(Box)`
	position: absolute;
	inset: 8%;
	border-radius: 50%;
	z-index: 1;
	background:
		radial-gradient(
			110% 110% at 25% 20%,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(255, 255, 255, 0.35) 35%,
			rgba(255, 255, 255, 0.05) 70%
		),
		linear-gradient(
			155deg,
			rgba(255, 255, 255, 0.65),
			rgba(241, 247, 251, 0.45)
		);
	backdrop-filter: blur(20px) saturate(140%);
	box-shadow:
		inset 0 1px 0 rgba(255, 255, 255, 0.9),
		inset 0 -2px 14px rgba(6, 11, 14, 0.08),
		0 18px 40px -20px rgba(6, 11, 14, 0.18),
		0 4px 14px -8px var(--donut-glow, ${palette.warning.main});
`;

export const DonutSvg = styled.svg`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	z-index: 3;
	overflow: visible;
	transform: translate(var(--donut-sx), var(--donut-sy))
		rotateX(var(--donut-rx)) rotateY(var(--donut-ry));
`;

export const DonutGlassHighlight = styled(Box)`
	position: absolute;
	inset: 10%;
	border-radius: 50%;
	z-index: 4;
	pointer-events: none;
	background:
		radial-gradient(
			60% 30% at 35% 22%,
			rgba(255, 255, 255, 0.85),
			transparent 70%
		),
		radial-gradient(
			40% 18% at 65% 78%,
			rgba(255, 255, 255, 0.4),
			transparent 70%
		);
	mix-blend-mode: screen;
`;

export const DonutCenter = styled(Box)`
	position: relative;
	z-index: 5;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2px;
	text-align: center;
	pointer-events: none;
`;

export const DonutPercent = styled(Text)`
	font-size: 28px;
	font-weight: 700;
	letter-spacing: -0.02em;
	color: ${palette.text.primary};
	font-variant-numeric: tabular-nums;
	line-height: 1;
`;

export const DonutMeta = styled(Text)`
	font-size: 11px;
	font-weight: 600;
	color: ${palette.text.secondary};
	line-height: 1.2;
`;
