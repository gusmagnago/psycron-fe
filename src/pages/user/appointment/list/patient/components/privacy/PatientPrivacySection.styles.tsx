import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PrivacySectionRoot = styled(Box)`
	background: ${palette.background.paper};
	border: 1px solid ${palette.gray['02']};
	border-radius: ${spacing.small};
	box-shadow: ${shadowSmall};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding: ${spacing.medium};
`;

export const ConsentList = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.extraSmall};
`;

export const ConsentRow = styled(Box)`
	align-items: center;
	background: ${hexToRgba(palette.brand.purple, 0.05)};
	border: 1px solid ${hexToRgba(palette.brand.purple, 0.14)};
	border-radius: ${spacing.small};
	display: flex;
	gap: ${spacing.small};
	justify-content: space-between;
	padding: ${spacing.small};
`;

export const ConsentText = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
`;

export const DeletionActions = styled(Box)`
	display: flex;
	gap: ${spacing.small};
	justify-content: flex-end;
`;
