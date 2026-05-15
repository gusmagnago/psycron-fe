import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const PatientsList = styled(Box)`
	display: flex;
	flex-direction: column;
`;

export const EmptyPatientsState = styled(Box)`
	color: ${palette.text.secondary};
	font-size: 14px;
	line-height: 1.4;
	padding: ${spacing.small} 0;
`;

export const PatientRow = styled(motion.div)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.xs} 0;
	border-bottom: 1px solid ${palette.gray['01']};
	cursor: pointer;
	transition: background 0.15s ease;

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background: ${palette.gray['01']};
		border-radius: 8px;
		padding-left: ${spacing.xs};
		padding-right: ${spacing.xs};
	}
`;

export const PatientInfo = styled(Box)`
	flex: 1;
	min-width: 0;
`;

export const PatientName = styled.span`
	display: block;
	font-size: 14px;
	font-weight: 600;
	color: ${palette.text.primary};
`;

export const PatientMeta = styled.span`
	font-size: 12px;
	color: ${palette.text.secondary};
`;

export const MessageButton = styled.button`
	all: unset;
	width: 32px;
	height: 32px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${palette.text.disabled};
	transition: color 0.15s ease, background 0.15s ease;
	cursor: pointer;
	flex-shrink: 0;

	&:hover {
		color: ${palette.primary.dark};
		background: ${palette.primary.surface.light};
	}

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 2px;
	}
`;

export const ViewAllLink = styled.a`
	font-size: 13px;
	font-weight: 600;
	color: ${palette.primary.dark};
	text-decoration: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 3px;

	&:hover {
		color: ${palette.tertiary.main};
	}
`;
