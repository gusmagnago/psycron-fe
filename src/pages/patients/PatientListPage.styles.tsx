import styled from '@emotion/styled';
import { Box, MenuItem, TextField } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PatientListLayout = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};

	${isMobileMedia} {
		gap: ${spacing.small};
	}
`;

export const ControlsBar = styled(Box)`
	align-items: flex-end;
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: minmax(0, 1.5fr) repeat(2, minmax(12rem, 1fr)) auto;

	${isMobileMedia} {
		align-items: stretch;
		grid-template-columns: 1fr;
	}
`;

export const AddPatientAction = styled(Box)`
	align-self: end;
	display: flex;

	& > button,
	& .MuiButton-root {
		height: 56px;
		white-space: nowrap;
	}

	${isMobileMedia} {
		width: 100%;

		& > button,
		& .MuiButton-root {
			width: 100%;
		}
	}
`;

export const FieldGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const FieldLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const ControlField = styled(TextField)`
	.MuiInputBase-root {
		background: ${palette.background.paper};
		border-radius: ${spacing.medium};
	}
`;

export const StyledMenuItem = styled(MenuItem)`
	font-size: 0.95rem;
`;

export const EmptyState = styled(Box)`
	align-items: center;
	background: linear-gradient(
		180deg,
		${hexToRgba(palette.background.paper, 0.96)} 0%,
		${hexToRgba(palette.background.default, 0.92)} 100%
	);
	border-radius: ${spacing.large};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	justify-content: center;
	min-height: 18rem;
	padding: ${spacing.large};
	text-align: center;

	${isMobileMedia} {
		min-height: 14rem;
		padding: ${spacing.medium};
	}
`;

export const EmptyTitle = styled(Text)`
	font-size: 1.1rem;
	font-weight: 700;
`;

export const EmptyBody = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.95rem;
	max-width: 34rem;
`;

export const PatientTableSurface = styled(Box)`
	background: ${palette.background.paper};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.12)};
	border-radius: ${spacing.large};
	box-shadow: ${shadowMedium};
	overflow-x: auto;
	overflow-y: hidden;
`;

export const PatientTableHeader = styled(Box)`
	display: grid;
	gap: ${spacing.small};
	grid-template-columns:
		minmax(12rem, 1.55fr) minmax(10rem, 1.05fr) minmax(5rem, 0.5fr)
		minmax(9rem, 0.9fr) minmax(10rem, 1fr) minmax(9rem, 0.95fr) minmax(
			5rem,
			0.4fr
		);
	min-width: 100%;
	padding: ${spacing.small} ${spacing.medium};
	background: ${hexToRgba(palette.background.default, 0.7)};
	border-bottom: 1px solid ${hexToRgba(palette.gray['04'], 0.12)};
`;

export const PatientHeaderCell = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const SortableHeaderButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	align-items: center;
	background: transparent;
	border: none;
	color: ${({ isActive }) =>
		isActive ? palette.text.primary : palette.gray['05']};
	cursor: pointer;
	display: inline-flex;
	font: inherit;
	font-size: 0.78rem;
	font-weight: 700;
	gap: ${spacing.xxs};
	letter-spacing: 0.04em;
	padding: 0;
	text-transform: uppercase;

	&:hover {
		color: ${palette.text.primary};
	}
`;

export const SortIndicator = styled('span')`
	font-size: 0.72rem;
	font-weight: 800;
	line-height: 1;
`;

export const PatientTableRow = styled('button')`
	align-items: center;
	background: ${palette.background.paper};
	border: none;
	border-bottom: 1px solid ${hexToRgba(palette.gray['04'], 0.08)};
	cursor: pointer;
	display: grid;
	gap: ${spacing.small};
	grid-template-columns:
		minmax(12rem, 1.55fr) minmax(10rem, 1.05fr) minmax(5rem, 0.5fr)
		minmax(9rem, 0.9fr) minmax(10rem, 1fr) minmax(9rem, 0.95fr) minmax(
			5rem,
			0.4fr
		);
	min-width: 100%;
	padding: ${spacing.small} ${spacing.medium};
	text-align: left;
	transition:
		background 160ms ease,
		transform 160ms ease;

	&:hover {
		background: ${palette.brand.light};
	}

	&:last-of-type {
		border-bottom: none;
	}
`;

export const PrimaryCell = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const PrimaryValue = styled(Text)`
	font-size: 0.98rem;
	font-weight: 700;
`;

export const SecondaryValue = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.88rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const SimpleValue = styled(Text)`
	font-size: 0.92rem;
`;

export const BillingCell = styled(Box)`
	display: flex;
	min-width: 0;
`;

export const BillingSummary = styled('span')`
	display: inline-flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	max-width: 100%;
	min-width: 0;
`;

export const BillingTooltipContent = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	max-width: 16rem;
`;

export const BillingTooltipRow = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: 0.1rem;
`;

export const IconCell = styled(Box)`
	align-items: center;
	display: flex;
	justify-content: center;
	min-width: 0;

	svg {
		color: ${palette.secondary.main};
		height: 20px;
		width: 20px;
	}
`;

export const StatusPill = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
	align-items: center;
	background: ${({ active }) =>
		active
			? hexToRgba(palette.success.main, 0.12)
			: hexToRgba(palette.gray['04'], 0.12)};
	border: 1px solid
		${({ active }) =>
			active
				? hexToRgba(palette.success.main, 0.22)
				: hexToRgba(palette.gray['04'], 0.2)};
	border-radius: 999px;
	color: ${({ active }) =>
		active ? palette.success.main : palette.gray['06']};
	display: inline-flex;
	font-size: 0.76rem;
	font-weight: 700;
	justify-content: center;
	padding: 0.18rem ${spacing.xs};
	text-transform: uppercase;
`;

export const DuplicateWarningPill = styled('button')`
	align-items: center;
	background: ${hexToRgba(palette.warning.main, 0.12)};
	border: 1px solid ${hexToRgba(palette.warning.main, 0.22)};
	border-radius: 999px;
	color: ${palette.warning.dark};
	cursor: pointer;
	display: inline-flex;
	font-size: 0.72rem;
	font-weight: 700;
	justify-content: center;
	padding: 0.18rem ${spacing.xs};
	text-transform: uppercase;
	white-space: nowrap;

	&:hover {
		background: ${hexToRgba(palette.warning.main, 0.2)};
	}
`;

export const CancellationNoticePill = styled(Box)`
	align-items: center;
	background: ${hexToRgba(palette.error.main, 0.1)};
	border: 1px solid ${hexToRgba(palette.error.main, 0.18)};
	border-radius: 999px;
	color: ${palette.error.main};
	display: inline-flex;
	font-size: 0.72rem;
	font-weight: 700;
	justify-content: center;
	padding: 0.18rem ${spacing.xs};
	text-transform: uppercase;
	white-space: nowrap;
`;

export const MobileCards = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const MobileCard = styled('button')`
	background: ${palette.background.paper};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.12)};
	border-radius: ${spacing.large};
	box-shadow: ${shadowSmall};
	cursor: pointer;
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding: ${spacing.small};
	text-align: left;

	&:hover {
		background: ${palette.brand.light};
	}
`;

export const MobileCardTop = styled(Box)`
	align-items: flex-start;
	display: flex;
	gap: ${spacing.small};
	justify-content: space-between;
`;

export const MobileCardBadges = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xxs};
	justify-content: flex-end;
`;

export const MobileMetaGrid = styled(Box)`
	display: grid;
	gap: ${spacing.xs};
	grid-template-columns: repeat(2, minmax(0, 1fr));
`;

export const MobileMetaItem = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const MetaLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.76rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;
