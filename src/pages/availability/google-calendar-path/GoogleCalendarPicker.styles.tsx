import { Box, styled, Typography } from '@mui/material';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PickerCard = styled(Box)`
	background-color: ${hexToRgba(palette.brand.purple, 0.06)};
	border: 1px solid ${hexToRgba(palette.brand.purple, 0.15)};
	border-radius: 16px;
	padding: ${spacing.mediumSmall};
	max-width: 400px;
	align-self: flex-start;

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	animation: slideIn 300ms ease-out;
`;

export const PickerHeader = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	margin-bottom: ${spacing.extraSmall};
`;

export const BackBtn = styled('button')`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border-radius: 8px;
	border: none;
	background: ${hexToRgba(palette.brand.purple, 0.08)};
	cursor: pointer;
	transition: background 150ms ease;
	flex-shrink: 0;
	color: ${palette.brand.purple};
	padding: 0;

	&:hover {
		background: ${hexToRgba(palette.brand.purple, 0.16)};
	}

	& svg {
		width: 16px;
		height: 16px;
	}
`;

export const PickerTitle = styled(Typography)`
	font-size: 14px;
	font-weight: 600;
	color: ${palette.text.primary};
	text-align: left;
`;

export const CalendarList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	margin-bottom: ${spacing.small};
`;

export const CalendarOption = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
	padding: ${spacing.xs} ${spacing.small};
	border-radius: 10px;
	border: 1.5px solid
		${({ isSelected }) =>
			isSelected
				? palette.brand.purple
				: hexToRgba(palette.text.primary, 0.12)};
	background-color: ${({ isSelected }) =>
		isSelected ? hexToRgba(palette.brand.purple, 0.08) : 'transparent'};
	cursor: pointer;
	transition: all 150ms ease;
	text-align: left;

	&:hover {
		border-color: ${palette.brand.purple};
		background-color: ${hexToRgba(palette.brand.purple, 0.06)};
	}
`;

export const CalendarDot = styled(Box)<{ color?: string }>`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	flex-shrink: 0;
	background-color: ${({ color }) => color ?? palette.brand.purple};
`;

export const CalendarName = styled(Typography)`
	font-size: 13px;
	color: ${palette.text.primary};
	flex: 1;
	text-align: left;
`;

export const PrimaryBadge = styled(Typography)`
	font-size: 11px;
	color: ${palette.text.secondary};
	background-color: ${hexToRgba(palette.brand.purple, 0.06)};
	padding: 2px 8px;
	border-radius: 6px;
	font-weight: 500;
`;

export const ConfirmBtn = styled(Box)`
	display: flex;
	justify-content: flex-start;
	margin-top: ${spacing.xs};
`;
