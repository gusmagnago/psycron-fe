import styled from '@emotion/styled';
import { Box, Modal } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import {
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const EditPatientModal = styled(Modal)`
	align-items: center;
	display: flex;
	justify-content: center;
	padding: ${spacing.medium};
`;

export const EditPatientFormRoot = styled('form')`
	background: ${palette.background.paper};
	border-radius: ${spacing.large};
	box-shadow: ${shadowSmall};
	display: flex;
	flex-direction: column;
	max-height: min(90vh, 58rem);
	max-width: 46rem;
	overflow: hidden;
	width: 100%;
`;

export const EditPatientHeader = styled(Box)`
	align-items: flex-start;
	background: ${palette.background.paper};
	display: flex;
	gap: ${spacing.small};
	justify-content: space-between;
	padding: ${spacing.mediumLarge};
	position: sticky;
	top: 0;
	z-index: 1;
	padding-bottom: ${spacing.small};

	${isMobileMedia} {
		padding: ${spacing.mediumSmall};
	}
`;

export const EditPatientTitleGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const EditPatientTitle = styled(Text)`
	font-size: 1.25rem;
	font-weight: 800;
`;

export const EditPatientDescription = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.9rem;
`;

export const EditPatientCloseButton = styled('button')`
	align-items: center;
	background: ${hexToRgba(palette.gray['04'], 0.08)};
	border: 1px solid ${hexToRgba(palette.gray['04'], 0.14)};
	border-radius: 999px;
	color: ${palette.text.primary};
	cursor: pointer;
	display: inline-flex;
	height: 2.25rem;
	justify-content: center;
	padding: 0;
	width: 2.25rem;

	svg {
		height: 1rem;
		width: 1rem;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.56;
	}
`;

export const EditPatientSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const BillingGrid = styled(Box)`
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: repeat(2, minmax(0, 1fr));

	${isSmallerThanTabletMedia} {
		grid-template-columns: 1fr;
	}
`;

export const BillingFieldGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const BillingChoiceRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const BillingChoiceDescription = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.88rem;
	line-height: 1.45;
`;

export const BillingChoiceButton = styled('button', {
	shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>`
	background: ${({ isSelected }) =>
		isSelected
			? hexToRgba(palette.tertiary.main, 0.1)
			: hexToRgba(palette.background.paper, 0.86)};
	border: 1px solid
		${({ isSelected }) =>
			isSelected
				? hexToRgba(palette.tertiary.main, 0.42)
				: hexToRgba(palette.gray['04'], 0.14)};
	border-radius: ${spacing.small};
	box-shadow: ${({ isSelected }) =>
		isSelected ? `0 0 0 2px ${hexToRgba(palette.tertiary.main, 0.1)}` : 'none'};
	color: ${palette.text.primary};
	cursor: pointer;
	font: inherit;
	font-size: 0.92rem;
	font-weight: 700;
	min-height: 2.5rem;
	padding: ${spacing.xs} ${spacing.small};
	transition:
		background-color 160ms ease,
		border-color 160ms ease,
		box-shadow 160ms ease;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.64;
	}
`;

export const EditPatientBody = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.small};
	overflow-y: auto;
	padding: ${spacing.mediumLarge};
	padding-top: ${spacing.small};

	${isMobileMedia} {
		padding: ${spacing.mediumSmall};
	}
`;

export const EditPatientSectionTitle = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const EditPatientActions = styled(Box)`
	display: flex;
	gap: ${spacing.small};
	justify-content: flex-end;

	${isSmallerThanTabletMedia} {
		flex-direction: column-reverse;
	}
`;

export const EditPatientSecondaryButton = styled(Button)`
	min-width: 8rem;
`;

export const EditPatientSubmitButton = styled(Button)`
	min-width: 8rem;
`;
