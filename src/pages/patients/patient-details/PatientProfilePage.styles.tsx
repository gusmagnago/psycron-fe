import styled from '@emotion/styled';
import { Box, IconButton } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isMobileMedia,
	isSmallerThanMediumMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMedium, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ProfileLayout = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	padding: ${spacing.large} 0 calc(${spacing.large} * 2);

	${isMobileMedia} {
		gap: ${spacing.small};
		padding-top: ${spacing.medium};
	}

	${isSmallerThanMediumMedia} {
		margin-bottom: 60px;
	}
`;

export const HeroCard = styled(Box)`
	background: linear-gradient(
		135deg,
		${hexToRgba(palette.background.paper, 0.98)} 0%,
		${palette.brand.light} 100%
	);
	border-radius: ${spacing.large};
	box-shadow: ${shadowMedium};
	display: grid;
	gap: ${spacing.medium};
	grid-template-columns: minmax(0, 1.35fr) minmax(16rem, 0.9fr);
	padding: ${spacing.large};

	${isMobileMedia} {
		grid-template-columns: 1fr;
		padding: ${spacing.medium};
	}
`;

export const IdentityCluster = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.medium};
	min-width: 0;
`;

export const IdentityText = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	min-width: 0;
`;

export const HeroHeaderRow = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.small};
	justify-content: flex-start;
`;

export const HeroActions = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
`;

export const HeroIconButton = styled(IconButton)`
	background: ${palette.background.paper};
	box-shadow: ${shadowSmall};
	border: 2px solid ${palette.brand.purple};

	&:hover {
		background: ${palette.brand.light};
		color: ${palette.text.primary};
	}

	& svg {
		height: 18px;
		width: 18px;
		color: ${palette.brand.purple};
	}
`;

export const PatientName = styled(Text)`
	font-size: 1.35rem;
	font-weight: 800;
	line-height: 1.2;
`;

export const PatientMeta = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.95rem;
`;

export const StatusPill = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'status',
})<{ status: 'ACTIVE' | 'ARCHIVED' | 'MERGED' }>`
	align-items: center;
	background: ${({ status }) =>
		status === 'ACTIVE'
			? hexToRgba(palette.success.main, 0.12)
			: status === 'MERGED'
				? hexToRgba(palette.info.main, 0.12)
				: hexToRgba(palette.gray['04'], 0.14)};
	border: 1px solid
		${({ status }) =>
			status === 'ACTIVE'
				? hexToRgba(palette.success.main, 0.24)
				: status === 'MERGED'
					? hexToRgba(palette.info.main, 0.24)
					: hexToRgba(palette.gray['04'], 0.22)};
	border-radius: 999px;
	color: ${({ status }) =>
		status === 'ACTIVE'
			? palette.success.main
			: status === 'MERGED'
				? palette.info.main
				: palette.gray['06']};
	display: inline-flex;
	font-size: 0.76rem;
	font-weight: 800;
	letter-spacing: 0.04em;
	padding: 0.2rem ${spacing.xs};
	text-transform: uppercase;
	width: fit-content;
`;

export const ShortcutRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const ShortcutLink = styled('a', {
	shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone?: 'info' | 'secondary' | 'success' }>`
	align-items: center;
	background: ${palette.background.paper};
	border: 1px solid ${hexToRgba(palette.brand.purple, 0.14)};
	border-radius: ${spacing.small};
	color: ${({ tone }) =>
		tone === 'info'
			? palette.info.main
			: tone === 'success'
				? palette.success.main
				: tone === 'secondary'
					? palette.secondary.main
					: palette.text.primary};
	display: inline-flex;
	font-size: 0.88rem;
	font-weight: 700;
	gap: ${spacing.xxs};
	padding: ${spacing.xs} ${spacing.small};
	text-decoration: none;
	transition:
		background 160ms ease,
		border-color 160ms ease,
		transform 160ms ease;

	svg {
		height: 16px;
		width: 16px;
	}

	&:hover {
		background: ${palette.brand.light};
		border-color: ${hexToRgba(palette.brand.purple, 0.28)};
		transform: translateY(-1px);
	}
`;

export const StatsGrid = styled(Box)`
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: repeat(2, minmax(0, 1fr));
`;

export const StatCard = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
	background: ${({ isActive }) =>
		isActive
			? hexToRgba(palette.brand.purple, 0.12)
			: hexToRgba(palette.background.paper, 0.76)};
	border: 0;
	border-radius: ${spacing.medium};
	box-shadow: ${shadowSmall};
	color: ${palette.text.primary};
	cursor: pointer;
	font: inherit;
	padding: ${spacing.small};
	text-align: left;
	transition:
		background 160ms ease,
		box-shadow 160ms ease,
		transform 160ms ease;

	&:hover,
	&:focus-visible {
		background: ${hexToRgba(palette.brand.purple, 0.14)};
		box-shadow: ${shadowMedium};
		transform: translateY(-1px);
	}

	&:focus-visible {
		outline: 2px solid ${hexToRgba(palette.brand.purple, 0.5)};
		outline-offset: 3px;
	}
`;

export const StatValue = styled(Text)`
	font-size: 1.35rem;
	font-weight: 800;
	line-height: 1;
`;

export const StatLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	margin-top: ${spacing.xxs};
	text-transform: uppercase;
`;

export const ContentGrid = styled(Box)`
	display: grid;
	gap: ${spacing.medium};
	grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const SectionCard = styled(Box)`
	background: ${palette.background.paper};
	border-radius: ${spacing.large};
	box-shadow: ${shadowSmall};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding: ${spacing.medium};
`;

export const SectionTitle = styled(Text)`
	font-size: 1rem;
	font-weight: 800;
`;

export const DetailGrid = styled(Box)`
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: repeat(2, minmax(0, 1fr));

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const DetailItem = styled(Box)`
	background: ${hexToRgba(palette.background.default, 0.62)};
	border-radius: ${spacing.medium};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
	padding: ${spacing.small};
`;

export const DetailLabel = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.76rem;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const DetailValue = styled(Text)`
	font-size: 0.95rem;
	font-weight: 600;
	overflow-wrap: anywhere;
`;

export const MutedValue = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.9rem;
`;

export const SessionList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	max-height: 28rem;
	overflow-y: auto;
	padding-right: ${spacing.xxs};
`;

export const SessionRow = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isCancelled',
})<{ isCancelled: boolean }>`
	background: ${({ isCancelled }) =>
		isCancelled
			? hexToRgba(palette.error.main, 0.06)
			: hexToRgba(palette.background.default, 0.7)};
	border: 1px solid
		${({ isCancelled }) =>
			isCancelled
				? hexToRgba(palette.error.main, 0.16)
				: hexToRgba(palette.gray['04'], 0.1)};
	border-radius: ${spacing.medium};
	color: ${palette.text.primary};
	cursor: pointer;
	display: flex;
	font: inherit;
	gap: ${spacing.small};
	justify-content: space-between;
	padding: ${spacing.small};
	text-align: left;
	transition:
		background 160ms ease,
		box-shadow 160ms ease,
		transform 160ms ease;

	&:hover,
	&:focus-visible {
		box-shadow: ${shadowSmall};
		transform: translateY(-1px);
	}

	&:focus-visible {
		outline: 2px solid ${hexToRgba(palette.brand.purple, 0.5)};
		outline-offset: 3px;
	}

	${isMobileMedia} {
		flex-direction: column;
	}
`;

export const SessionMain = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const SessionDate = styled(Text)`
	align-items: center;
	display: flex;
	font-size: 0.94rem;
	font-weight: 700;
	gap: ${spacing.xxs};

	svg {
		flex-shrink: 0;
		height: 16px;
		width: 16px;
	}
`;

export const SessionMeta = styled(Text)`
	align-items: center;
	color: ${palette.gray['05']};
	display: flex;
	flex-wrap: wrap;
	font-size: 0.84rem;
	gap: ${spacing.xxs};

	svg {
		flex-shrink: 0;
		height: 14px;
		width: 14px;
	}
`;

export const SessionStatus = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isCancelled' && prop !== 'isPast',
})<{ isCancelled: boolean; isPast: boolean }>`
	align-items: center;
	background: ${({ isCancelled, isPast }) =>
		isCancelled
			? hexToRgba(palette.error.main, 0.1)
			: isPast
				? hexToRgba(palette.gray['04'], 0.14)
				: hexToRgba(palette.success.main, 0.12)};
	border-radius: 999px;
	color: ${({ isCancelled, isPast }) =>
		isCancelled
			? palette.error.main
			: isPast
				? palette.gray['06']
				: palette.success.main};
	display: inline-flex;
	font-size: 0.74rem;
	font-weight: 800;
	height: fit-content;
	letter-spacing: 0.04em;
	padding: 0.18rem ${spacing.xs};
	text-transform: uppercase;
	width: fit-content;
`;

export const EmptyPanel = styled(Box)`
	align-items: center;
	background: ${hexToRgba(palette.background.default, 0.7)};
	border: 1px dashed ${hexToRgba(palette.gray['04'], 0.2)};
	border-radius: ${spacing.medium};
	display: flex;
	justify-content: center;
	min-height: 8rem;
	padding: ${spacing.medium};
	text-align: center;
`;

export const DrawerDetailsList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const DrawerDetailItem = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const DrawerFormGrid = styled(Box)`
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: repeat(2, minmax(0, 1fr));

	${isMobileMedia} {
		grid-template-columns: 1fr;
	}
`;

export const DrawerFullWidthField = styled(Box)`
	grid-column: 1 / -1;
`;

export const DrawerShareAction = styled(Box)`
	align-items: center;
	display: flex;
	justify-content: center;
	padding-top: ${spacing.xs};
`;
