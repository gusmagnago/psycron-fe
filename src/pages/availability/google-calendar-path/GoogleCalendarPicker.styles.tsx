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

export const PickerTitle = styled(Typography)`
	font-size: 14px;
	font-weight: 600;
	color: ${palette.text.primary};
	margin-bottom: ${spacing.extraSmall};
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
`;

export const PrimaryBadge = styled(Typography)`
	font-size: 11px;
	color: ${palette.text.secondary};
	font-style: italic;
`;

export const ConfirmBtn = styled(Box)`
	display: flex;
	justify-content: flex-end;
	margin-top: ${spacing.xs};
`;
