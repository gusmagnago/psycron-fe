import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowPress, shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const FormSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.mediumSmall};
`;

export const SectionTitle = styled(Box)`
	color: ${palette.text.secondary};
	font-size: 0.875rem;
	font-weight: 600;
	letter-spacing: 0.05em;
	margin-bottom: ${spacing.xs};
	text-transform: uppercase;
`;

export const RecurrenceOption = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	align-items: center;
	border: 1.5px solid
		${({ isSelected }) =>
			isSelected ? palette.brand.purple : palette.gray['02']};
	border-radius: ${spacing.small};
	cursor: pointer;
	display: flex;
	gap: ${spacing.extraSmall};
	padding: ${spacing.extraSmall} ${spacing.small};
	transition: border-color 0.15s;

	box-shadow: ${({ isSelected }) => (isSelected ? shadowSmall : shadowPress)};
	background-color: ${({ isSelected }) =>
		isSelected ? palette.brand.light : palette.background.paper};

	&:hover {
		border-color: ${palette.brand.dark};
		box-shadow: ${({ isSelected }) =>
			!isSelected ? shadowSmall : shadowPress};

		background-color: ${({ isSelected }) =>
			isSelected ? palette.brand.dark : palette.brand.light};
		color: ${({ isSelected }) =>
			isSelected ? palette.white : palette.text.primary};
	}
`;

export const NotifyBox = styled(Box)`
	background: ${palette.gray['01']};
	border-radius: ${spacing.small};
	padding: ${spacing.small};
	box-shadow: ${shadowSmall};
`;

export const NotifyCheckboxWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	padding-left: ${spacing.small};
`;

export const ConsentBox = styled(Box)`
	background: ${palette.background.paper};
	border: 1px solid ${palette.gray['02']};
	border-radius: ${spacing.small};
	padding: ${spacing.small};
`;

export const ConsentLabel = styled('span')`
	color: ${palette.text.primary};
	font-size: 0.875rem;
	line-height: 1.5;

	a {
		color: ${palette.brand.purple};
		font-weight: 600;
		text-decoration: underline;
	}
`;
