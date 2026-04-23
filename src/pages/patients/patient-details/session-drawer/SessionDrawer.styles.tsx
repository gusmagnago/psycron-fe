import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const CancelForm = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const CancelReasonGrid = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(2, 1fr);
`;

export const CancelReasonOption = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	background: ${({ isSelected }) =>
		isSelected
			? hexToRgba(palette.error.main, 0.12)
			: palette.background.paper};
	border: 1px solid
		${({ isSelected }) =>
			isSelected
				? hexToRgba(palette.error.main, 0.35)
				: hexToRgba(palette.gray['04'], 0.2)};
	border-radius: ${spacing.medium};
	color: ${({ isSelected }) =>
		isSelected ? palette.error.main : palette.text.primary};
	cursor: pointer;
	font: inherit;
	font-size: 0.84rem;
	font-weight: ${({ isSelected }) => (isSelected ? 700 : 400)};
	padding: ${spacing.small};
	text-align: center;
	transition:
		background 140ms ease,
		border-color 140ms ease,
		color 140ms ease;

	&:hover {
		background: ${hexToRgba(palette.error.main, 0.07)};
		border-color: ${hexToRgba(palette.error.main, 0.2)};
	}

	&:focus-visible {
		outline: 2px solid ${hexToRgba(palette.error.main, 0.5)};
		outline-offset: 2px;
	}
`;

export const NotificationRow = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
	justify-content: flex-end;
`;

export const ReschedulePicker = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const RescheduleGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const RescheduleGroupLabel = styled(Box)`
	color: ${palette.text.secondary};
	font-size: 0.82rem;
	font-weight: 700;
`;

export const RescheduleSlotsRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const RescheduleSlotChip = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	background: ${({ isSelected }) =>
		isSelected
			? hexToRgba(palette.brand.purple, 0.12)
			: palette.background.paper};
	border: 1px solid
		${({ isSelected }) =>
			isSelected
				? hexToRgba(palette.brand.purple, 0.36)
				: hexToRgba(palette.gray['04'], 0.2)};
	border-radius: ${spacing.medium};
	color: ${({ isSelected }) =>
		isSelected ? palette.brand.purple : palette.text.primary};
	cursor: pointer;
	font: inherit;
	font-size: 0.84rem;
	font-weight: ${({ isSelected }) => (isSelected ? 700 : 500)};
	padding: ${spacing.xs} ${spacing.small};
	transition:
		background 140ms ease,
		border-color 140ms ease,
		color 140ms ease;

	&:hover {
		background: ${hexToRgba(palette.brand.purple, 0.08)};
		border-color: ${hexToRgba(palette.brand.purple, 0.24)};
	}

	&:focus-visible {
		outline: 2px solid ${hexToRgba(palette.brand.purple, 0.45)};
		outline-offset: 2px;
	}
`;

export const RescheduleEmpty = styled(Box)`
	color: ${palette.text.secondary};
	font-size: 0.9rem;
	text-align: center;
`;
