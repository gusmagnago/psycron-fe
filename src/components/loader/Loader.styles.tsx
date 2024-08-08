import { Box, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const LoaderWrapper = styled(Box)`
	width: 5rem;
	height: 3.75rem;
	padding: ${spacing.xs};
	display: flex;
	justify-content: space-between;
	background: transparent;
	align-items: center;
	filter: blur(0.5px);
`;

export const Ball = styled(motion.div)`
	width: 1.25rem;
	height: 1.25rem;
	border-radius: 50%;
	background: ${palette.secondary.main};
`;
