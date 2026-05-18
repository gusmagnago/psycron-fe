import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const GreetingWidgetRoot = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.small};
	height: 100%;
	min-width: 0;
`;

export const GreetingCopy = styled(motion.div)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
	min-width: 0;
	text-align: left;
`;

export const GreetingEyebrow = styled.span`
	color: ${palette.text.secondary};
	font-size: 0.8125rem;
	font-weight: 700;
	line-height: 1.2;
	text-transform: uppercase;
`;

export const GreetingHeadline = styled.h2`
	color: ${palette.text.primary};
	font-size: 1.625rem;
	font-weight: 800;
	line-height: 1.12;
	margin: 0;

	${isBiggerThanTabletMedia} {
		font-size: 2rem;
	}
`;
