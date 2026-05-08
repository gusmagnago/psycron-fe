import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const ControlsBar = styled(motion.div)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const CustomizeButton = styled.button<{ isActive?: boolean }>`
	all: unset;
	display: flex;
	align-items: center;
	gap: 6px;
	padding: ${spacing.xxs} ${spacing.extraSmall};
	border-radius: 10px;
	border: 1px solid
		${({ isActive }) =>
			isActive ? palette.tertiary.main : palette.gray['02']};
	background: ${({ isActive }) =>
		isActive ? palette.tertiary.surface.light : 'transparent'};
	color: ${({ isActive }) =>
		isActive ? palette.tertiary.main : palette.text.secondary};
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.15s ease;

	&:hover {
		border-color: ${palette.tertiary.main};
		color: ${palette.tertiary.main};
	}

	&:focus-visible {
		outline: 2px solid ${palette.tertiary.main};
		outline-offset: 2px;
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

export const EditModeBanner = styled(motion.div)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	padding: ${spacing.xs} ${spacing.medium};
	border-radius: 12px;
	background: ${palette.tertiary.surface.light};
	border: 1px solid ${palette.tertiary.light};
	font-size: 13px;
	color: ${palette.tertiary.dark};
	font-weight: 500;
`;

export const BannerRow = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;
