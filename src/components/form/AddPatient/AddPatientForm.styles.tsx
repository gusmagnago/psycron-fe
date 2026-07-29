import styled from '@emotion/styled';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const AddPatientFormElement = styled('form')`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
`;

export const AddPatientFormFields = styled('div')`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
`;

export const AddPatientFormActions = styled('div')`
	display: flex;
	padding-top: ${spacing.small};
`;
