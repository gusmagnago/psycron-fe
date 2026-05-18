import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
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

export const CustomizeIconWrap = styled('span', {
	shouldForwardProp: (prop: string) => prop !== 'isActive',
})<{ isActive: boolean }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: ${({ isActive }) => (isActive ? palette.brand.purple : 'inherit')};
	background-color: ${({ isActive }) => (isActive ? palette.white : 'inherit')};
	transition: color 0.15s ease;
	border-radius: 100%;
	padding: ${spacing.xs};
	border: ${({ isActive }) =>
		isActive ? `2px solid ${palette.brand.purple}` : 'inherit'};
`;

export const ResetButton = styled(Button)`
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

export const OrganizeButton = styled(Button)`
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
