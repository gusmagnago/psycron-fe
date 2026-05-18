import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const GreetingRoot = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
`;

export const GreetingTextBlock = styled(motion.div)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
	text-align: justify;
`;

export const GreetingLabel = styled.span`
	font-size: 0.8125rem;
	font-weight: 500;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: ${palette.text.secondary};
`;

export const GreetingHeadline = styled.h1`
	margin: 0;
	font-size: 1.625rem;
	font-weight: 700;
	color: ${palette.text.primary};
	line-height: 1.2;

	${isBiggerThanTabletMedia} {
		font-size: 2rem;
	}
`;
