import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const SlideRoot = styled(motion.div)`
	display: flex;
	flex-direction: column;
	min-height: 0;
	position: relative;
	height: 100%;
`;

export const SlideText = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.875rem;
	font-weight: 600;
	line-height: 1.45;
	margin: 0;
	text-align: left;
`;

export const SlideActions = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const SlidePrimaryAction = styled(Button)`
	&& {
		border-radius: 99px;
		font-size: 0.8125rem;
		font-weight: 600;
		padding: ${spacing.xs} ${spacing.small};
		white-space: nowrap;
	}
`;

export const SlideSecondaryAction = styled(Button)`
	&& {
		background: ${hexToRgba(palette.white, 0.6)};
		border: none;
		border-radius: 99px;
		color: ${palette.text.primary};
		font-size: 0.8125rem;
		font-weight: 500;
		padding: ${spacing.xs} ${spacing.small};
		white-space: nowrap;

		&:hover {
			background: ${hexToRgba(palette.white, 0.85)};
			border: none;
		}
	}
`;
