import styled from '@emotion/styled';
import { Box, FormGroup } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const SettingsPageWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	width: 100%;
`;

export const SectionCard = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const SectionHeader = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const SectionTitle = styled(Text)`
	font-size: 1rem;
	font-weight: 600;
`;

export const SectionDesc = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.9rem;
	line-height: 1.5;
`;

export const SectionBody = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.extraSmall};
	padding-top: ${spacing.xxs};
`;

export const ChannelCheckboxGroup = styled(FormGroup)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding-left: ${spacing.xs};
`;

export const LeadTimeRow = styled(Box)`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
	padding-left: ${spacing.xs};
`;

export const LeadTimeChip = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	align-items: center;
	border-radius: 20px;
	border: 1.5px solid
		${({ isSelected }) =>
			isSelected ? 'var(--palette-primary-main)' : 'var(--palette-divider)'};
	color: ${({ isSelected }) =>
		isSelected ? 'var(--palette-primary-main)' : palette.gray['05']};
	cursor: pointer;
	display: inline-flex;
	font-size: 0.8125rem;
	font-weight: ${({ isSelected }) => (isSelected ? 600 : 400)};
	justify-content: center;
	padding: ${spacing.xxs} ${spacing.small};
	transition:
		border-color 0.15s,
		color 0.15s;

	&:hover {
		border-color: var(--palette-primary-main);
		color: var(--palette-primary-main);
	}
`;
