import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const AddressOverrideSection = styled(Box)`
	border: 1px solid ${palette.brand.purple};
	border-radius: ${spacing.mediumSmall};
	padding: 0 ${spacing.small} ${spacing.small} ${spacing.small};
	text-align: left;
	display: flex;
	flex-direction: row;
	gap: ${spacing.small};
	align-items: center;
`;

export const SlotLocationContent = styled(Box)`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export const AddressOverrideHeader = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${spacing.small};
	padding-top: ${spacing.small};
`;

export const AddressOverrideLabel = styled(Text)`
	font-size: 0.85rem;
	color: ${palette.gray['05']};
`;

export const AddressResetLink = styled(Text)`
	font-size: 0.8rem;
	color: ${palette.brand.purple};
	cursor: pointer;
	text-decoration: underline;
`;
