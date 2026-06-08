import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowDashboardTile } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const HelpCenterBody = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
`;

export const HelpCenterIntro = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.95rem;
	line-height: 1.55;
`;

export const HelpCenterOptionList = styled(Box)`
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: 1fr;
`;

export const HelpCenterOption = styled(Box)`
	background: ${hexToRgba(palette.white, 0.78)};
	border: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};
	border-radius: ${spacing.medium};
	box-shadow: ${shadowDashboardTile};
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	padding: ${spacing.mediumSmall};
`;

export const HelpCenterOptionTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.95rem;
	font-weight: 800;
`;

export const HelpCenterOptionBody = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.84rem;
	font-weight: 650;
	line-height: 1.45;
`;
