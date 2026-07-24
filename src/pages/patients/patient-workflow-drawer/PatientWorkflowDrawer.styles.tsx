import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const WorkflowDrawerBody = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	padding-top: ${spacing.xxs};
`;

export const WorkflowDrawerSubtitle = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.82rem;
`;

export const WorkflowSummary = styled('section')`
	background: ${palette.white};
	border-radius: ${spacing.medium};
	box-shadow: ${shadowSmall};
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding: ${spacing.mediumSmall};
`;

export const WorkflowStatus = styled(Text)`
	align-self: flex-start;
	background: ${palette.tertiary.light};
	border-radius: ${spacing.mediumSmall};
	color: ${palette.tertiary.dark};
	font-size: 0.75rem;
	font-weight: 800;
	padding: ${spacing.xxs} ${spacing.xs};

	&[data-action='send-follow-up'] {
		background: ${palette.secondary.light};
		color: ${palette.secondary.dark};
	}

	&[data-action='ready'] {
		background: ${palette.success.light};
		color: ${palette.success.dark};
	}

	&[data-action='set-billing'],
	&[data-action='add-contact-and-billing'] {
		background: ${palette.alert.light};
		color: ${palette.alert.dark};
	}
`;

export const WorkflowDetailGrid = styled(Box)`
	display: grid;
	gap: ${spacing.small};
	grid-template-columns: repeat(2, minmax(0, 1fr));
`;

export const WorkflowDetail = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const WorkflowDetailLabel = styled(Text)`
	color: ${palette.gray['08']};
	font-size: 0.7rem;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
`;

export const WorkflowDetailValue = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.9rem;
	font-weight: 700;
	overflow-wrap: anywhere;
`;

export const WorkflowSectionTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.9rem;
	font-weight: 800;
`;

export const WorkflowNextStep = styled(Box)`
	align-items: flex-start;
	display: grid;
	gap: ${spacing.extraSmall};
	grid-template-columns: 44px minmax(0, 1fr);
`;

export const WorkflowNextStepIcon = styled(Box)`
	align-items: center;
	background: ${palette.secondary.light};
	border-radius: ${spacing.extraSmall};
	color: ${palette.secondary.dark};
	display: flex;
	height: 44px;
	justify-content: center;
	width: 44px;

	svg {
		height: 22px;
		width: 22px;
	}
`;

export const WorkflowNextStepCopy = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xxs};
`;

export const WorkflowNextStepTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.9rem;
	font-weight: 800;
`;

export const WorkflowGuidance = styled(Text)`
	color: ${palette.text.secondary};
	font-size: 0.82rem;
	line-height: 1.5;
`;

export const WorkflowApproval = styled(Box)`
	align-items: flex-start;
	color: ${palette.text.secondary};
	display: flex;
	font-size: 0.78rem;
	gap: ${spacing.xs};
	line-height: 1.5;
	text-align: left;

	& > * {
		text-align: left;
	}

	svg {
		color: ${palette.success.dark};
		flex: 0 0 auto;
		height: 18px;
		margin-top: ${spacing.space};
		width: 18px;
	}
`;
