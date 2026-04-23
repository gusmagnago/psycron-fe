import styled from '@emotion/styled';
import { Box, Chip } from '@mui/material';
import {
	isBiggerThanTabletMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PageWrapper = styled(Box)`
	max-width: 1320px;
	margin: 0 auto;
	padding: ${spacing.medium} ${spacing.small} ${spacing.large};
`;

export const BookingSidebar = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	position: relative;
	z-index: 1;
`;

export const BookingTitleBlock = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const BookingMetaList = styled(Box)`
	display: grid;
	gap: ${spacing.small};
`;

export const BookingMetaRow = styled(Box)`
	align-items: flex-start;
	display: flex;
	gap: ${spacing.small};
`;

export const BookingMetaIcon = styled(Box)`
	align-items: center;
	background: ${palette.white};
	border-radius: ${spacing.small};
	box-shadow: ${shadowSmall};
	display: inline-flex;
	flex: 0 0 44px;
	height: calc(${spacing.mediumLarge} + ${spacing.small});
	justify-content: center;
	width: 100%;

	svg {
		height: 28px;
		width: 28px;
	}
`;

export const BookingMetaText = styled(Box)`
	align-items: flex-start;
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
	text-align: left;
`;

export const FilterTimeRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const TimeFilterChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	background: ${({ isActive }) =>
		isActive ? palette.brand.dark : palette.white};
	box-shadow: ${({ isActive }) => (isActive ? shadowMedium : shadowSmall)};
	border-radius: ${spacing.mediumSmall};
	color: ${({ isActive }) =>
		isActive ? palette.white : palette.text.secondary};
	cursor: pointer;
	font-size: 0.8125rem;
	font-weight: 700;
	padding: ${spacing.xs} ${spacing.small};
	transition:
		transform 0.15s ease,
		background 0.15s ease,
		box-shadow 0.15s ease;

	&:hover {
		transform: translateY(-1px);
	}
`;

export const EmptyState = styled(Box)`
	align-items: center;
	background: ${palette.white};
	border-radius: ${spacing.medium};
	box-shadow: ${shadowSmall};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	justify-content: center;
	min-height: 220px;
	padding: ${spacing.large};
	text-align: center;
`;

export const SlotList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const SlotButton = styled(Chip, {
	shouldForwardProp: (prop) =>
		!['isBooked', 'isSelected'].includes(String(prop)),
})<{ isBooked?: boolean; isSelected?: boolean }>`
	background: ${({ isBooked, isSelected }) =>
		isBooked
			? palette.gray['01']
			: isSelected
				? palette.brand.dark
				: palette.white};
	box-shadow: ${({ isBooked, isSelected }) =>
		isBooked ? 'none' : isSelected ? shadowMedium : shadowSmall};
	border-radius: ${spacing.mediumSmall};
	color: ${({ isBooked, isSelected }) =>
		isBooked
			? palette.text.disabled
			: isSelected
				? palette.white
				: palette.brand.purple};
	cursor: ${({ isBooked }) => (isBooked ? 'not-allowed' : 'pointer')};
	font-size: 1rem;
	font-weight: 700;
	height: 56px;
	justify-content: flex-start;
	padding-left: ${spacing.small};
	transition:
		transform 0.15s ease,
		box-shadow 0.15s ease,
		background 0.15s ease;

	&:hover {
		background: ${({ isBooked, isSelected }) =>
			isBooked
				? palette.gray['01']
				: isSelected
					? palette.brand.dark
					: palette.brand.light};
		box-shadow: ${({ isBooked }) => (isBooked ? 'none' : shadowMedium)};
		transform: ${({ isBooked }) => (isBooked ? 'none' : 'translateY(-1px)')};
	}

	.MuiChip-label {
		padding: 0 ${spacing.small} 0 0;
	}
`;

export const SkeletonLayout = styled(Box)`
	display: grid;
	gap: ${spacing.medium};
	grid-template-columns: 280px 1fr 300px;

	${isSmallerThanTabletMedia} {
		grid-template-columns: 1fr;
	}
`;

export const SkeletonCard = styled(Box)`
	background: ${palette.white};
	border-radius: ${spacing.mediumLarge};
	box-shadow: ${shadowSmall};
	min-height: 520px;
`;

export const AgendaSidebar = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
`;

export const AgendaStatGrid = styled(Box)`
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: repeat(2, minmax(0, 1fr));

	${isBiggerThanTabletMedia} {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`;

export const AgendaStatCard = styled(Box)`
	background: ${palette.white};
	border-radius: ${spacing.mediumSmall};
	box-shadow: ${shadowSmall};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.small};
`;

export const AgendaDayList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const AgendaAppointmentCard = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: 'cancelled' | 'confirmed' | 'past' }>`
	background: ${palette.white};
	box-shadow: ${shadowSmall};
	border-radius: ${spacing.medium};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small};
	transition:
		transform 0.15s ease,
		box-shadow 0.15s ease;

	&:hover {
		box-shadow: ${shadowMedium};
		transform: translateY(-1px);
	}
`;

export const NextAppointmentsScroll = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.small};
	max-height: calc(${spacing.xxl} * 7);
	min-height: 0;
	overflow-y: auto;
	padding: ${spacing.xxs} ${spacing.xs} ${spacing.xxs} 0;
`;

export const AvailableSlotsScroll = styled(NextAppointmentsScroll)`
	max-height: 100vh;
`;

export const NextAppointmentsMonth = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const NextAppointmentsMonthTitle = styled(Box)`
	background: ${palette.background.default};
	color: ${palette.text.secondary};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	padding: ${spacing.xs} 0 0;
	position: sticky;
	top: 0;
	text-transform: uppercase;
	z-index: 1;
`;

export const AgendaAppointmentHeader = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.small};
	justify-content: space-between;
`;

export const StatusBadge = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: 'cancelled' | 'confirmed' | 'past' }>`
	align-self: flex-start;
	background: ${({ tone }) =>
		tone === 'cancelled'
			? hexToRgba(palette.error.main, 0.12)
			: tone === 'past'
				? palette.gray['01']
				: hexToRgba(palette.success.main, 0.12)};
	border-radius: ${spacing.mediumSmall};
	color: ${({ tone }) =>
		tone === 'cancelled'
			? palette.error.main
			: tone === 'past'
				? palette.text.secondary
				: palette.success.dark};
	font-size: 0.75rem;
	font-weight: 700;
	padding: ${spacing.xxs} ${spacing.xs};
`;
