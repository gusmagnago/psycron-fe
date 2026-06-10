import styled from '@emotion/styled';
import { Box } from '@mui/material';
import {
	isBiggerThanTabletMedia,
	isMobileMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexAlert } from '@psycron/theme/zIndex';
import { motion } from 'framer-motion';

export const ControlsBar = styled(motion.div)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	z-index: ${zIndexAlert};
`;

export const CustomizeToggle = styled.button`
	all: unset;
	display: inline-flex;
	align-items: center;
	gap: ${spacing.xxs};
	padding: ${spacing.xs} ${spacing.sm};
	border-radius: 999px;
	color: ${palette.text.secondary};
	cursor: pointer;
	user-select: none;
	transition:
		color 0.15s ease,
		background-color 0.15s ease,
		box-shadow 0.15s ease;

	&:hover {
		color: ${palette.text.primary};
		background-color: ${palette.white};
		box-shadow: ${shadowSmall};
	}

	&:focus-visible {
		outline: 2px solid ${palette.brand.purple};
		outline-offset: 2px;
	}

	svg.ic {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
	}
`;

export const ResetButton = styled.button`
	all: unset;
	font-size: 12px;
	color: ${palette.text.disabled};
	cursor: pointer;
	padding: ${spacing.xxs} ${spacing.xs};
	border-radius: 8px;
	transition: color 0.15s ease;

	&:hover {
		color: ${palette.error.main};
	}

	&:focus-visible {
		outline: 2px solid ${palette.error.main};
		outline-offset: 2px;
	}
`;

export const OrganizeButton = styled.button`
	all: unset;
	font-size: 12px;
	color: ${palette.brand.purple};
	cursor: pointer;
	padding: ${spacing.xxs} ${spacing.xs};
	border-radius: 8px;
	transition: color 0.15s ease;

	&:hover {
		color: ${palette.tertiary.dark};
	}

	&:focus-visible {
		outline: 2px solid ${palette.tertiary.main};
		outline-offset: 2px;
	}
`;

export const EditModeBanner = styled(motion.div)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	padding: ${spacing.xs} ${spacing.medium};
	border-radius: 12px;
	box-shadow: ${shadowSmall};
	background: ${palette.tertiary.surface.light};
	font-size: 13px;
	color: ${palette.tertiary.dark};
	font-weight: 500;
	position: absolute;

	top: ${spacing.largeXl};
	width: max-content;
	left: 0;
	z-index: ${zIndexAlert};

	${isMobileMedia} {
		position: fixed;
		top: 1.25rem;
		transform: translateX(-20%);
		left: ${spacing.small};
		width: 90vw;
	}

	${isBiggerThanTabletMedia} {
		width: max-content;
	}
`;

export const BannerRow = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;
