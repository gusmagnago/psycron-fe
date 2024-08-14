/* eslint-disable indent */
import { Box, css, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';

export const BenefitsItems = styled(Box, {
	shouldForwardProp: (props) => props !== 'justify',
})<{ justify: string }>`
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
	flex-direction: column;
	padding: ${spacing.medium};
	align-items: ${({ justify }) => justify};

	${isBiggerThanMediumMedia} {
		flex-direction: ${({ justify }) =>
			justify.includes('end') ? 'row-reverse' : 'row'};
	}
`;

export const StyledAnimatedBox = styled(motion.div)`
	scroll-snap-type: y mandatory;
	scroll-behavior: smooth;
	height: 10rem;

	${isBiggerThanMediumMedia} {
		height: 12.5rem;
	}
`;

export const StyledImgWrapper = styled(Box)`
	height: 10rem;
	width: 100%;

	${isBiggerThanMediumMedia} {
		height: 12.5rem;
	}
`;

export const StyledTitle = styled(Text, {
	shouldForwardProp: (props) => props !== 'justify',
})<{ justify: string }>`
	font-size: 1.5rem;
	font-weight: 700;

	${isBiggerThanMediumMedia} {
		font-size: 2rem;
		padding-top: ${spacing.medium};

		${({ justify }) =>
			justify.includes('end')
				? css`
						text-align: end;
						margin-right: ${spacing.small};
					`
				: css`
						text-align: start;
					`}
	}
`;

export const StyledBox = styled(Box, {
	shouldForwardProp: (props) => props !== 'justify',
})<{ justify: string }>`
	display: flex;
	flex-direction: column;
	width: 100%;

	${({ justify }) =>
		justify.includes('end')
			? css`
					align-items: flex-end;
				`
			: css`
					align-items: flex-start;
				`}
`;

export const StyledMotionDescription = styled(motion.div, {
	shouldForwardProp: (props) => props !== 'y',
})<{ y: MotionValue<number> }>`
	width: 100%;

	transform: translateY(${({ y }) => `${y}px`});

	${isBiggerThanMediumMedia} {
		width: 50%;
	}
`;

export const StyledDescription = styled(Text)`
	font-size: 1rem;
	margin-top: 0;

	${isBiggerThanMediumMedia} {
		font-size: 1.5rem;
		margin-top: ${spacing.medium};
	}
`;
