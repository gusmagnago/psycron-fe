import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PageWrapper = styled(Box)`
	max-width: 840px;
	margin: 0 auto;
	padding: ${spacing.medium} ${spacing.small};
`;

export const PageHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	margin-bottom: ${spacing.medium};
`;

export const HeaderActions = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	margin-top: ${spacing.xs};
`;

export const Section = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	margin-bottom: ${spacing.large};
`;

export const SectionHeader = styled(Box)`
	align-items: center;
	display: flex;
	justify-content: space-between;
	gap: ${spacing.small};
`;

export const SectionLabel = styled(Box)`
	color: ${palette.text.secondary};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
`;

export const SectionCount = styled(Box)`
	background: ${palette.gray['01']};
	border-radius: 999px;
	color: ${palette.text.secondary};
	font-size: 0.75rem;
	font-weight: 700;
	padding: ${spacing.xxs} ${spacing.xs};
`;

export const AppointmentGrid = styled(Box)`
	display: grid;
	gap: ${spacing.small};
`;

export const SessionCard = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'statusTone',
})<{ statusTone: 'cancelled' | 'confirmed' | 'past' }>`
	background: ${palette.white};
	border: 1px solid
		${({ statusTone }) =>
			statusTone === 'cancelled'
				? `${palette.error.main}33`
				: statusTone === 'past'
					? palette.gray['02']
					: `${palette.success.main}33`};
	border-radius: 16px;
	box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	opacity: ${({ statusTone }) => (statusTone === 'past' ? 0.82 : 1)};
	padding: ${spacing.mediumSmall};
	transition:
		transform 0.16s ease,
		box-shadow 0.16s ease,
		border-color 0.16s ease;

	&:hover {
		box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
		transform: translateY(-1px);
	}
`;

export const SessionCardHeader = styled(Box)`
	align-items: flex-start;
	display: flex;
	gap: ${spacing.small};
	justify-content: space-between;
`;

export const SessionCardBody = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const StatusBadge = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'statusTone',
})<{ statusTone: 'cancelled' | 'confirmed' | 'past' }>`
	align-self: flex-start;
	background: ${({ statusTone }) =>
		statusTone === 'cancelled'
			? `${palette.error.main}14`
			: statusTone === 'past'
				? palette.gray['01']
				: `${palette.success.main}14`};
	border-radius: 999px;
	color: ${({ statusTone }) =>
		statusTone === 'cancelled'
			? palette.error.main
			: statusTone === 'past'
				? palette.text.secondary
				: palette.success.main};
	font-size: 0.75rem;
	font-weight: 700;
	padding: ${spacing.xxs} ${spacing.xs};
`;

export const MetaRow = styled(Box)`
	color: ${palette.text.secondary};
	display: flex;
	flex-wrap: wrap;
	font-size: 0.9rem;
	gap: ${spacing.xs};
`;

export const EmptyState = styled(Box)`
	align-items: center;
	background: ${palette.white};
	border: 1px dashed ${palette.gray['02']};
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.largeXl} ${spacing.medium};
	text-align: center;
`;

export const DrawerSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const DrawerSectionTitle = styled(Box)`
	color: ${palette.text.secondary};
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.06em;
	padding-bottom: ${spacing.xs};
	text-transform: uppercase;
`;

export const InfoCard = styled(Box)`
	background: ${palette.gray['01']};
	border-radius: 14px;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small};
`;

export const TherapistRow = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.small};
`;

export const TherapistText = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const DetailList = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
`;

export const DetailRow = styled(Box)`
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const ActionsRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	justify-content: space-between;
`;

export const InlineForm = styled(Box)`
	background: ${palette.gray['01']};
	border-radius: 14px;
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding: ${spacing.small};
`;

export const CancelReasonGrid = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(2, minmax(0, 1fr));
`;

export const CancelReasonOption = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	background: ${({ isSelected }) =>
		isSelected ? palette.error.surface.light : palette.white};
	border: 0;
	border-radius: ${spacing.small};
	color: ${({ isSelected }) =>
		isSelected ? palette.error.main : palette.text.secondary};
	cursor: pointer;
	font: inherit;
	font-size: 0.875rem;
	font-weight: 700;
	padding: ${spacing.xs} ${spacing.small};
	text-align: left;
	transition:
		background 0.15s ease,
		color 0.15s ease;

	&:hover {
		background: ${palette.error.surface.light};
		color: ${palette.error.main};
	}
`;

export const ReschedulePicker = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	max-height: 320px;
	overflow: auto;
`;

export const RescheduleDay = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const RescheduleSlots = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const RescheduleSlotChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	background: ${({ isSelected }) =>
		isSelected ? palette.primary.light : palette.white};
	border: 1px solid
		${({ isSelected }) =>
			isSelected ? palette.primary.main : palette.gray['02']};
	border-radius: 999px;
	color: ${palette.primary.dark};
	cursor: pointer;
	font-size: 0.875rem;
	font-weight: 600;
	padding: ${spacing.xs} ${spacing.small};
`;
