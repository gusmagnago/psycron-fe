import styled from '@emotion/styled';
import { Box, Chip, TextField } from '@mui/material';
import { PUBLIC_TOP_BAR_BOTTOM } from '@psycron/layouts/public-booking/PublicBookingShell.styles';
import {
	isBiggerThanTabletMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexSticky } from '@psycron/theme/zIndex';

export const PageWrapper = styled(Box)`
	max-width: 800px;
	margin: 0 auto;
	padding: ${spacing.medium} ${spacing.small};
`;

export const FiltersRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.small};
	margin-bottom: ${spacing.mediumSmall};
	justify-content: center;

	${isSmallerThanTabletMedia} {
		gap: 0;
		flex-direction: row;
		justify-content: space-between;
	}
`;

export const Datepiker = styled(TextField)`
	width: 150px;

	${isBiggerThanTabletMedia} {
		width: auto;
	}
`;

export const FilterTimeRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	margin-bottom: ${spacing.medium};
`;

export const TimeFilterChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	background: ${({ isActive }) =>
		isActive ? palette.primary.main : palette.white};
	border: 1.5px solid
		${({ isActive }) => (isActive ? palette.primary.main : palette.gray['02'])};
	border-radius: 20px;
	color: ${({ isActive }) =>
		isActive ? palette.primary.dark : palette.text.secondary};
	cursor: pointer;
	font-size: 0.8125rem;
	font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
	padding: ${spacing.xxs} ${spacing.extraSmall};
	transition:
		background 0.15s,
		border-color 0.15s,
		color 0.15s;
	user-select: none;

	&:hover {
		border-color: ${palette.primary.main};
		color: ${palette.primary.dark};
	}
`;

export const DaySection = styled(Box)`
	margin-bottom: ${spacing.medium};
	position: relative;
`;

export const DayLabel = styled(Box)`
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${palette.background.default};
	color: ${palette.brand.dark};
	font-size: 1rem;
	font-weight: 600;
	letter-spacing: 0.04em;
	margin-bottom: ${spacing.xs};
	padding: ${spacing.xxs} 0;
	position: sticky;
	text-transform: uppercase;
	top: ${PUBLIC_TOP_BAR_BOTTOM};
	z-index: ${zIndexSticky};
`;

export const SlotsRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	justify-content: center;
`;

export const SlotChip = styled(Chip, {
	shouldForwardProp: (prop) => prop !== 'isBooked',
})<{ isBooked?: boolean }>`
	background: ${({ isBooked }) =>
		isBooked ? palette.gray['01'] : palette.white};
	border: 1.5px solid
		${({ isBooked }) => (isBooked ? 'transparent' : palette.primary.main)};
	border-radius: 20px;
	color: ${({ isBooked }) =>
		isBooked ? palette.text.disabled : palette.primary.dark};
	cursor: ${({ isBooked }) => (isBooked ? 'not-allowed' : 'pointer')};
	font-size: 0.875rem;
	font-weight: 500;
	height: 40px;
	opacity: ${({ isBooked }) => (isBooked ? 0.55 : 1)};
	text-decoration: ${({ isBooked }) => (isBooked ? 'line-through' : 'none')};
	transition:
		background 0.12s,
		box-shadow 0.12s;

	&:hover {
		background: ${({ isBooked }) =>
			isBooked ? palette.gray['01'] : palette.primary.light};
		box-shadow: ${({ isBooked }) =>
			isBooked ? 'none' : '0 0 0 3px rgba(169,222,249,0.35)'};
	}

	.MuiChip-label {
		padding: 0 ${spacing.extraSmall};
	}
`;

export const EmptyState = styled(Box)`
	align-items: center;
	border: 1px dashed ${palette.gray['02']};
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.largeXl} ${spacing.small};
	text-align: center;
`;

export const SkeletonDay = styled(Box)`
	margin-bottom: ${spacing.medium};
`;

export const SkeletonRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	margin-top: ${spacing.xs};
`;
