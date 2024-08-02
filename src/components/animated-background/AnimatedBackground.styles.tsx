import { Box, css, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { motion } from 'framer-motion';

export const primaryGradient = css`
	background: conic-gradient(
		from 10deg at 50% 50%,
		${palette.primary.main} 0deg,
		${palette.primary.main} 55deg,
		${palette.secondary.main} 120deg,
		${palette.background.paper} 160deg,
		transparent 360deg
	);
`;

export const secondaryGradient = css`
	background: conic-gradient(
		from 90deg at 50% 50%,
		${palette.primary.main} 0deg,
		${palette.background.paper} 160deg,
		${palette.primary.main}120deg,
		${palette.secondary.main} 55deg,
		transparent 360deg
	);
`;

export const AnimatedBackgroundWrapper = styled(Box)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
`;

export const GradientBackground = styled(motion.div)`
	position: absolute;
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: -1;
`;

export const GradientBlob = styled(motion.div, {
	shouldForwardProp: (props) => props !== 'gradient',
})<{ gradient: 'primary' | 'secondary' }>`
	position: absolute;
	border-radius: 50%;
	filter: blur(90px);
	opacity: 0.8;

	${({ gradient }) =>
		gradient === 'primary'
			? css`
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
					${primaryGradient};
				`
			: css`
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
					${secondaryGradient};
				`}
`;
