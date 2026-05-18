import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Avatar } from '@psycron/components/avatar/Avatar';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

export const PatientsList = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isWide',
})<{ isWide?: boolean }>`
	display: grid;
	grid-template-columns: ${({ isWide }) => (isWide ? 'repeat(2, 1fr)' : '1fr')};
	gap: ${spacing.xs};
`;

export const EmptyPatientsState = styled(Box)`
	color: ${palette.text.secondary};
	font-size: 14px;
	line-height: 1.4;
	padding: ${spacing.small} 0;
`;

export const PatientRow = styled(motion.div)`
	align-items: center;
	border-bottom: 1px solid ${palette.gray['01']};
	cursor: pointer;
	display: flex;
	gap: ${spacing.small};
	padding: ${spacing.xs} 0;
	text-align: left;
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

export const PatientAvatar = styled(Avatar)`
	font-size: 13px !important;
	font-weight: 700 !important;
`;

export const PatientInfo = styled(Box)`
	flex: 1;
	min-width: 0;
`;

export const PatientName = styled.span`
	color: ${palette.text.primary};
	display: block;
	font-size: 14px;
	font-weight: 600;
`;

export const PatientMeta = styled.span`
	color: ${palette.text.secondary};
	font-size: 12px;
`;

export const MessageButton = styled.button`
	all: unset;
	align-items: center;
	border-radius: 8px;
	cursor: pointer;
	color: ${palette.text.disabled};
	display: flex;
	flex-shrink: 0;
	height: 32px;
	justify-content: center;
	transition:
		color 0.15s ease,
		background 0.15s ease;
	width: 32px;

	& svg {
		height: 16px;
		width: 16px;
	}

	&:hover {
		background: ${palette.primary.surface.light};
		color: ${palette.primary.dark};
	}

	&:focus-visible {
		outline: 2px solid ${palette.primary.main};
		outline-offset: 2px;
	}
`;
