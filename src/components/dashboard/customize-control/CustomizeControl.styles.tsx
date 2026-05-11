import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const ControlsBar = styled(motion.div)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const CustomizeIconWrap = styled('span', {
	shouldForwardProp: (prop: string) => prop !== 'isActive',
})<{ isActive: boolean }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: ${({ isActive }) => (isActive ? palette.tertiary.main : 'inherit')};
	transition: color 0.15s ease;
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
	right: ${spacing.small};
	top: 4.375rem;

	${isBiggerThanTabletMedia} {
		top: 1.25rem;
	}
`;

export const BannerRow = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;
