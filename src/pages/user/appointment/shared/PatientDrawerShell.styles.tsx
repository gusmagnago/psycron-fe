import styled from '@emotion/styled';
import { Box, Chip } from '@mui/material';
import {
	DrawerContent,
	DrawerPanel,
} from '@psycron/components/drawer/Drawer.styles';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ShellPanel = styled(DrawerPanel)`
	overflow: hidden;
`;

export const AccentBar = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'accentColor',
})<{ accentColor: string }>`
	background: ${({ accentColor }) => accentColor};
	height: ${spacing.xxs};
	width: 100%;
`;

export const ShellContent = styled(DrawerContent)`
	background: ${palette.white};
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	overflow: hidden;
`;

export const ShellHeader = styled(Box)`
	align-items: flex-start;
	display: flex;
	flex-shrink: 0;
	gap: ${spacing.small};
	justify-content: space-between;
	padding: ${spacing.medium} ${spacing.medium} ${spacing.small};
`;

export const HeaderContent = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xs};
	min-width: 0;
`;

export const RoleChip = styled(Chip)`
	align-self: flex-start;
	background: ${palette.gray['01']};
	border-radius: ${spacing.mediumSmall};
	box-shadow: ${shadowSmall};
	font-size: 0.7rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
`;

export const HeaderRow = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const StatusChip = styled(Chip, {
	shouldForwardProp: (prop) => prop !== 'accentColor',
})<{ accentColor: string }>`
	background: ${({ accentColor }) => `${accentColor}1A`};
	box-shadow: ${shadowSmall};
	color: ${({ accentColor }) => accentColor};
	font-weight: 700;
`;

export const HeaderActions = styled(Box)`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	gap: ${spacing.xs};
`;

export const ShellBody = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.medium};
	min-height: 0;
	overflow-y: auto;
	padding: 0 ${spacing.medium} ${spacing.medium};
`;

export const Actions = styled(Box)`
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	gap: ${spacing.xs};
	padding: ${spacing.small} ${spacing.medium} ${spacing.medium};
`;

export const FallbackActions = styled(Box)`
	padding: 0 ${spacing.medium} ${spacing.medium};
`;
