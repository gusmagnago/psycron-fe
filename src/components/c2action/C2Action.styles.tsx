import { Box, styled, TextField } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import {
	isBiggerThanMediumMedia,
	isBiggerThanTabletMedia,
	isMobileMedia,
	isTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const C2ActionWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	padding: ${spacing.small};
	border-radius: ${spacing.medium};
	box-shadow: ${shadowMain};
	border: 1px solid rgba(255, 255, 255, 0.3);

	background-color: ${palette.background.paper};

	width: 100%;
	margin-top: ${spacing.large};

	${isBiggerThanMediumMedia} {
		width: 50%;
	}

	${isTabletMedia} {
		width: 100%;
	}

	${isMobileMedia} {
		padding: ${spacing.small};
		margin-top: 0;
	}
`;

export const C2ActionBox = styled(motion.div)`
	display: flex;
	align-items: center;
	flex-direction: column;
	width: auto;

	height: 8.25rem;
	padding-top: ${spacing.small};

	${isBiggerThanMediumMedia} {
		flex-direction: row;
		justify-content: center;
	}
`;

export const C2ActionText = styled(Text)`
	text-align: left;

	${isBiggerThanTabletMedia} {
		text-align: center;
	}
`;

export const C2ActionButton = styled(Button)`
	width: 100%;
	margin-left: 0;
	margin-top: ${spacing.small};

	${isBiggerThanMediumMedia} {
		margin-left: ${spacing.small};
		margin-top: 0;
		width: 12rem;
	}

	${isMobileMedia} {
		margin-top: ${spacing.xs};
	}
`;

export const HighlightedText = styled('span')`
	color: ${palette.secondary.main};
	font-weight: 600;
`;

export const StyledTextField = styled(TextField)`
	text-align: center;

	& .MuiInputLabel-root.Mui-focused {
		top: -0.625rem !important;
		left: -0.625rem !important;
	}

	& .MuiInputLabel-root.Mui-error {
		top: -0.625rem !important;
		left: -0.625rem !important;
	}
`;
