import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, MenuItem, TextField } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import {
	isBiggerThanMediumMedia,
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowDashboardTile,
	shadowMedium,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover, zIndexSticky } from '@psycron/theme/zIndex';

const attentionPulse = keyframes`
	0%, 100% { opacity: 0.35; transform: scale(0.82); }
	50% { opacity: 1; transform: scale(1); }
`;

export const PatientListLayout = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};

	${isMobileMedia} {
		gap: ${spacing.small};
	}
`;

export const SectionLabel = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.extraSmall};

	&::after {
		background: ${palette.gray['02']};
		content: '';
		flex: 1;
		height: 1px;
		min-width: ${spacing.largeXl};
	}

	${isMobileMedia} {
		align-items: flex-start;
		flex-direction: column;

		&::after {
			display: none;
		}
	}
`;

export const SectionLabelCopy = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
`;

export const SectionTitle = styled(Text)`
	color: ${palette.gray['08']};
	font-size: 0.75rem;
	font-weight: 800;
	letter-spacing: 0.07em;
	text-transform: uppercase;
`;

export const SectionPurpose = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.72rem;
	font-weight: 600;
`;

export const WorkQueues = styled('section')`
	align-items: start;
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: repeat(4, minmax(0, 1fr));

	${isSmallerThanTabletMedia} {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const FloatingQueuesTrigger = styled(Button)`
	border-bottom-right-radius: 0;
	border-top-right-radius: 0;
	box-shadow: ${shadowMedium};
	inset-inline-end: 0;
	min-height: 48px;
	position: fixed;
	top: 50%;
	transform: translateY(-50%);
	z-index: ${zIndexSticky};

	&:hover {
		transform: translateY(-50%);
	}

	${isMobileMedia} {
		bottom: calc(${spacing.xl} + env(safe-area-inset-bottom));
		top: auto;
		transform: none;

		&:hover {
			transform: none;
		}
	}
`;

export const FloatingQueuesTriggerCount = styled('span')`
	align-items: center;
	background: ${palette.white};
	border-radius: ${spacing.medium};
	color: ${palette.black};
	display: inline-flex;
	font-size: 0.75rem;
	font-variant-numeric: tabular-nums;
	font-weight: 800;
	justify-content: center;
	min-height: ${spacing.mediumSmall};
	min-width: ${spacing.mediumSmall};
	padding: 0 ${spacing.space};
`;

export const FloatingQueuesTriggerIcon = styled('span')`
	align-items: center;
	display: inline-flex;

	svg {
		height: ${spacing.mediumSmall};
		width: ${spacing.mediumSmall};
	}
`;

export const FloatingQueuesPanel = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	padding-top: ${spacing.xs};
`;

export const QueueCard = styled('button')`
	align-items: flex-start;
	background: ${palette.white};
	border: 2px solid transparent;
	border-radius: ${spacing.medium};
	box-sizing: border-box;
	box-shadow: ${shadowDashboardTile};
	color: ${palette.text.primary};
	cursor: pointer;
	display: flex;
	gap: ${spacing.extraSmall};
	padding: ${spacing.small};
	text-align: left;
	touch-action: manipulation;
	transition:
		background 180ms ease,
		box-shadow 180ms ease,
		transform 180ms ease;

	${isBiggerThanMediumMedia} {
		height: 100%;
	}

	&:hover {
		box-shadow: ${shadowSmall};
		transform: translateY(-1px);
	}

	&[data-state='clear'] {
		cursor: default;
	}

	&[data-state='clear']:hover {
		box-shadow: ${shadowDashboardTile};
		transform: none;
	}

	&[aria-pressed='true'] {
		background: ${palette.white};
		border-color: ${palette.brand.purple};
		box-shadow: ${shadowDashboardTile};
	}

	&:focus-visible {
		outline: 3px solid ${hexToRgba(palette.brand.purple, 0.35)};
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const QueueIcon = styled('span')`
	align-items: center;
	background: ${palette.tertiary.light};
	border-radius: ${spacing.extraSmall};
	color: ${palette.brand.dark};
	display: inline-flex;
	flex: 0 0 auto;
	height: 40px;
	justify-content: center;
	width: 40px;

	svg {
		height: 20px;
		width: 20px;
	}

	[data-queue='recovery'] & {
		background: ${palette.error.surface.light};
		color: ${palette.error.dark};
	}

	[data-queue='billing'] & {
		background: ${palette.warning.light};
		color: ${palette.warning.dark};
	}

	[data-queue='duplicate'] & {
		background: ${palette.primary.light};
		color: ${palette.primary.dark};
	}

	[data-state='clear'] & {
		background: ${palette.success.light};
		color: ${palette.success.dark};
	}
`;

export const QueueCopy = styled('span')`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.space};
	min-width: 0;
`;

export const QueueTop = styled('span')`
	align-items: baseline;
	display: flex;
	gap: ${spacing.xs};
	justify-content: space-between;
`;

export const QueueTitle = styled(Text)`
	font-size: 0.9rem;
	font-weight: 700;
`;

export const QueueCount = styled(Text)`
	color: ${palette.black};
	font-size: 1.1rem;
	font-variant-numeric: tabular-nums;
	font-weight: 800;
`;

export const QueueDescription = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.78rem;
	line-height: 1.45;
`;

export const Workspace = styled('section')`
	background: ${palette.white};
	border-radius: ${spacing.large};
	box-shadow: ${shadowDashboardTile};
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	padding: ${spacing.medium};

	${isMobileMedia} {
		background: transparent;
		box-shadow: none;
		padding: 0;
	}
`;

export const ControlsBar = styled(Box)`
	align-items: flex-end;
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: minmax(0, 1.6fr) repeat(2, minmax(11rem, 0.8fr)) auto;

	${isSmallerThanTabletMedia} {
		grid-template-columns: 1fr 1fr auto;

		& > :first-of-type {
			grid-column: 1 / -1;
		}
	}

	${isMobileMedia} {
		align-items: stretch;
		grid-template-columns: 1fr;

		& > :first-of-type {
			grid-column: auto;
		}
	}
`;

export const AddPatientAction = styled(Box)`
	align-self: end;
	display: flex;

	& > button,
	& .MuiButton-root {
		min-height: 44px;
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

export const FieldLabel = styled('label')`
	color: ${palette.gray['08']};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const ControlField = styled(TextField)`
	.MuiInputBase-root {
		background: ${palette.background.paper};
		border-radius: ${spacing.medium};
		min-height: 48px;
	}
`;

export const StyledMenuItem = styled(MenuItem)`
	font-size: 0.95rem;
`;

export const ColumnsWrapper = styled(Box)`
	position: relative;
`;

export const ColumnsPanel = styled(Box)`
	background: ${palette.white};
	border-radius: ${spacing.medium};
	box-shadow: ${shadowMedium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.extraSmall};
	position: absolute;
	right: 0;
	top: calc(100% + ${spacing.xs});
	width: 15rem;
	z-index: ${zIndexHover};

	${isMobileMedia} {
		left: 0;
		right: auto;
		width: 100%;
	}
`;

export const ColumnOption = styled('label')`
	align-items: center;
	border-radius: ${spacing.extraSmall};
	cursor: pointer;
	display: flex;
	font-size: 0.85rem;
	gap: ${spacing.xs};
	min-height: 40px;
	padding: ${spacing.xs};

	&:hover {
		background: ${palette.background.paper};
	}

	input {
		accent-color: ${palette.brand.purple};
		height: 18px;
		width: 18px;
	}
`;

export const ResultsHeader = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.small};
	justify-content: space-between;
`;

export const ResultsTitleGroup = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
`;

export const ResultsTitle = styled(Text)`
	font-size: 1rem;
	font-weight: 700;
`;

export const ResultsCount = styled(Text)`
	background: ${palette.tertiary.light};
	border-radius: ${spacing.medium};
	color: ${palette.brand.dark};
	font-size: 0.76rem;
	font-weight: 800;
	padding: ${spacing.space} ${spacing.xs};
`;

export const ResultsHint = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.78rem;

	${isMobileMedia} {
		display: none;
	}
`;

export const PatientTableSurface = styled(Box)`
	border-radius: ${spacing.medium};
	overflow-x: auto;
	transition: opacity 160ms ease;

	&[data-refreshing='true'] {
		opacity: 0.62;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}

	${isSmallerThanTabletMedia} {
		overflow: visible;
	}
`;

export const PatientTable = styled('table')`
	border-collapse: collapse;
	min-width: 100%;
	width: 100%;

	${isSmallerThanTabletMedia} {
		display: block;

		thead {
			display: none;
		}

		tbody {
			display: flex;
			flex-direction: column;
			gap: ${spacing.small};
		}
	}
`;

export const PatientHeaderCell = styled('th')`
	background: ${palette.background.default};
	color: ${palette.gray['08']};
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	padding: ${spacing.extraSmall} ${spacing.small};
	text-align: left;
	text-transform: uppercase;
	white-space: nowrap;

	&:first-of-type {
		border-radius: ${spacing.small} 0 0 ${spacing.small};
	}

	&:last-of-type {
		border-radius: 0 ${spacing.small} ${spacing.small} 0;
		width: 52px;
	}
`;

export const SortableHeaderButton = styled('button')`
	align-items: center;
	background: transparent;
	border: 0;
	border-radius: ${spacing.xs};
	color: inherit;
	cursor: pointer;
	display: inline-flex;
	font: inherit;
	gap: ${spacing.xxs};
	min-height: 36px;
	padding: 0 ${spacing.space};
	text-transform: inherit;

	&:hover,
	&:focus-visible {
		background: ${palette.brand.light};
		color: ${palette.brand.dark};
	}
`;

export const SortIndicator = styled('span')`
	align-items: center;
	display: inline-flex;

	svg {
		height: 15px;
		width: 15px;
	}
`;

export const PatientTableRow = styled('tr')`
	border-bottom: 1px solid ${hexToRgba(palette.gray['04'], 0.12)};
	cursor: pointer;
	touch-action: manipulation;
	transition: background 180ms ease;

	&:hover {
		background: ${palette.tertiary.surface.light};
	}

	&:focus-visible {
		outline: 3px solid ${hexToRgba(palette.brand.purple, 0.35)};
		outline-offset: -3px;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}

	${isSmallerThanTabletMedia} {
		background: ${palette.white};
		border: 0;
		border-radius: ${spacing.medium};
		box-shadow: ${shadowDashboardTile};
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		overflow: hidden;
		padding: ${spacing.small};
		position: relative;
	}
`;

export const PatientCell = styled('td')`
	min-width: 0;
	padding: ${spacing.small};
	vertical-align: middle;

	${isSmallerThanTabletMedia} {
		border: 0;
		padding: 0;

		&::before {
			color: ${palette.gray['08']};
			content: attr(data-label);
			display: block;
			font-size: 0.65rem;
			font-weight: 800;
			letter-spacing: 0.05em;
			margin-bottom: ${spacing.space};
			text-transform: uppercase;
		}

		&[data-column='patient'] {
			grid-column: 1 / -1;
			padding: 0 ${spacing.xl} ${spacing.extraSmall} 0;

			&::before {
				display: none;
			}
		}

		&[data-column='contact'] {
			background: ${palette.background.paper};
			border-radius: ${spacing.small} 0 0 ${spacing.small};
			display: flex;
			grid-column: 1 / 4;
			padding: ${spacing.extraSmall} ${spacing.xxs} ${spacing.extraSmall}
				${spacing.extraSmall};

			&::before {
				display: none;
			}
		}

		&[data-column='next-action'] {
			align-items: center;
			background: ${palette.background.paper};
			border-radius: 0 ${spacing.small} ${spacing.small} 0;
			display: flex;
			grid-column: 4 / 7;
			justify-content: flex-end;
			padding: ${spacing.extraSmall} ${spacing.extraSmall} ${spacing.extraSmall}
				${spacing.xxs};

			&::before {
				display: none;
			}
		}

		&[data-column='next-session'] {
			grid-column: 1 / 3;
			padding: ${spacing.small} ${spacing.xs} 0 0;
		}

		&[data-column='billing'] {
			grid-column: 3 / 5;
			padding: ${spacing.small} ${spacing.xs} 0 0;
		}

		&[data-column='sessions'] {
			font-variant-numeric: tabular-nums;
			grid-column: 5 / 7;
			padding-top: ${spacing.small};
			text-align: right;

			&::before {
				text-align: right;
			}
		}

		&[data-column='open'] {
			position: absolute;
			right: ${spacing.extraSmall};
			top: ${spacing.extraSmall};

			&::before {
				display: none;
			}
		}
	}
`;

export const PatientSummary = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
	min-width: 0;
`;

export const PrimaryValue = styled(Text)`
	font-size: 0.98rem;
	font-weight: 700;
`;

export const SecondaryValue = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.82rem;
	overflow-wrap: anywhere;
`;

export const SimpleValue = styled(Text)`
	font-size: 0.88rem;
	overflow-wrap: anywhere;
`;

export const ContactValue = styled('span')`
	align-items: center;
	display: inline-flex;
	gap: ${spacing.xs};
	max-width: 100%;
	min-width: 0;

	&[data-missing='true'] {
		color: ${palette.error.dark};
		font-weight: 700;
	}
`;

export const ContactIcon = styled('span')`
	align-items: center;
	background: ${palette.secondary.light};
	border-radius: ${spacing.xs};
	color: ${palette.secondary.dark};
	display: inline-flex;
	flex: 0 0 auto;
	height: 32px;
	justify-content: center;
	width: 32px;

	[data-missing='true'] & {
		background: ${palette.error.surface.light};
		color: ${palette.error.dark};

		svg {
			animation: ${attentionPulse} 1.7s ease-in-out infinite;
		}
	}

	svg {
		height: 18px;
		width: 18px;
	}

	@media (prefers-reduced-motion: reduce) {
		svg {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
`;

export const ActionPill = styled('button')`
	align-items: center;
	background: ${palette.tertiary.light};
	border: 0;
	border-radius: ${spacing.medium};
	color: ${palette.brand.dark};
	cursor: pointer;
	display: inline-flex;
	font-size: 0.76rem;
	font-weight: 800;
	gap: ${spacing.xs};
	line-height: 1.25;
	max-width: 100%;
	padding: ${spacing.xs} ${spacing.extraSmall};

	&::before {
		background: currentColor;
		border-radius: 50%;
		content: '';
		flex: 0 0 auto;
		height: 7px;
		width: 7px;
	}

	&[data-action='ready'] {
		background: ${palette.success.surface.light};
		color: ${palette.success.dark};
	}

	&:not([data-action='ready'])::before {
		animation: ${attentionPulse} 1.7s ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		&::before {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
`;

export const NextSessionValue = styled('span')`
	align-items: center;
	display: inline-flex;
	font-size: 0.88rem;
	gap: ${spacing.xxs};

	&[data-state='approaching'],
	&[data-state='imminent'] {
		color: ${palette.brand.dark};
		font-weight: 700;
	}

	&[data-state='imminent'] svg {
		animation: ${attentionPulse} 1.7s ease-in-out infinite;
	}

	&[data-state='now'] {
		color: ${palette.success.dark};
		font-weight: 800;
	}

	svg {
		height: 17px;
		width: 17px;
	}

	@media (prefers-reduced-motion: reduce) {
		svg {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
`;

export const BillingSummary = styled('span')`
	display: inline-flex;
	flex-direction: column;
	gap: ${spacing.space};
	max-width: 100%;
	min-width: 0;
`;

export const BillingTooltipContent = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	max-width: 16rem;
`;

export const BillingTooltipRow = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
`;

export const MetaLabel = styled(Text)`
	color: ${palette.gray['08']};
	font-size: 0.72rem;
	font-weight: 700;
`;

export const OpenAction = styled('button')`
	align-items: center;
	background: ${palette.brand.light};
	border: 0;
	border-radius: 50%;
	color: ${palette.brand.dark};
	cursor: pointer;
	display: inline-flex;
	height: 44px;
	justify-content: center;
	width: 44px;

	&:hover,
	&:focus-visible {
		background: ${palette.tertiary.light};
		outline: 3px solid ${hexToRgba(palette.brand.purple, 0.25)};
	}

	svg {
		height: 20px;
		width: 20px;
	}
`;

export const EmptyState = styled(Box)`
	align-items: center;
	background: ${palette.background.paper};
	border-radius: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	justify-content: center;
	padding: ${spacing.large};
	text-align: center;
`;

export const EmptyTitle = styled(Text)`
	font-size: 1.1rem;
	font-weight: 700;
`;

export const EmptyBody = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.9rem;
	max-width: 34rem;
`;

export const LoadMoreRow = styled(Box)`
	display: flex;
	justify-content: center;
	padding: ${spacing.small} 0;
`;

export const VisuallyHidden = styled('span')`
	clip: rect(0 0 0 0);
	clip-path: inset(50%);
	height: 1px;
	overflow: hidden;
	position: absolute;
	white-space: nowrap;
	width: 1px;
`;
