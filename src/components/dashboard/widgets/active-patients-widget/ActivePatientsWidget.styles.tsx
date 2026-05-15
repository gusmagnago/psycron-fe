import styled from '@emotion/styled';
import { Avatar as MUIAvatar, Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const PatientList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const PatientRow = styled(motion.button, {
	shouldForwardProp: (prop) => prop !== 'avatarColor',
})<{ avatarColor: string }>`
	all: unset;
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.xxs} ${spacing.xs};
	border-radius: ${spacing.xs};
	cursor: pointer;
	transition: background 0.15s ease;

	&:hover {
		background: ${palette.primary.surface.light};
	}

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 2px;
	}
`;

export const PatientAvatar = styled(MUIAvatar, {
	shouldForwardProp: (prop) => prop !== 'avatarColor',
})<{ avatarColor: string }>`
	background-color: ${({ avatarColor }) => avatarColor};
	width: 36px;
	height: 36px;
	font-size: 12px;
	font-weight: 700;
	color: ${palette.white};
	flex-shrink: 0;
`;

export const PatientInfo = styled(Box)`
	display: flex;
	flex-direction: column;
	min-width: 0;
`;

export const PatientName = styled(Text)`
	font-size: 13px;
	font-weight: 600;
	color: ${palette.text.primary};
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const PatientDate = styled(Text)`
	font-size: 11px;
	color: ${palette.text.secondary};
`;

export const EmptyState = styled(Text)`
	font-size: 13px;
	color: ${palette.text.disabled};
	padding-top: ${spacing.xs};
`;
