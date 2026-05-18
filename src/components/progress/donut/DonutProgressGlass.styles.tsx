import styled from '@emotion/styled';
import { Box, CircularProgress, circularProgressClasses } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';

export const DonutGlassFrame = styled(Box)`
	position: relative;
	display: inline-grid;
	place-items: center;
	isolation: isolate;
	perspective: 800px;

	--donut-rx: 0deg;
	--donut-ry: 0deg;

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

export const DonutProgress = styled(CircularProgress)`
	display: block;
	color: var(--donut-progress-color, ${palette.success.main});
	transition: color 200ms ease;

	& .${circularProgressClasses.circle} {
		stroke-linecap: round;
		transition: none;
	}

	& .${circularProgressClasses.track} {
		opacity: 1;
		stroke: ${palette.gray['01']};
	}
`;

export const DonutCenter = styled(Box)`
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2px;
	text-align: center;
	pointer-events: none;
	z-index: 5;
`;

export const DonutPercent = styled(Text)`
	font-size: var(--donut-label-font, 28px);
	font-weight: 700;
	letter-spacing: -0.02em;
	color: ${palette.text.primary};
	font-variant-numeric: tabular-nums;
	line-height: 1;
`;

export const DonutMeta = styled(Text)`
	font-size: var(--donut-meta-font, 11px);
	font-weight: 600;
	color: ${palette.text.secondary};
	line-height: 1.2;
`;
