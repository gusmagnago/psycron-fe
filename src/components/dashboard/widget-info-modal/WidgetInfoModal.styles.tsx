import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const InfoModalBody = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
`;

export const InfoModalDescription = styled.p`
	color: ${palette.text.secondary};
	font-size: 14px;
	line-height: 1.6;
	margin: 0;
`;

export const InfoModalFutureSection = styled(Box)`
	background: ${palette.gray['00']};
	border-left: 3px solid ${palette.primary.main};
	border-radius: 0 ${spacing.xs} ${spacing.xs} 0;
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding: ${spacing.small};
`;

export const InfoModalFutureHeading = styled.span`
	color: ${palette.primary.main};
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.06em;
	text-transform: uppercase;
`;

export const InfoModalFutureText = styled.p`
	color: ${palette.text.secondary};
	font-size: 13px;
	line-height: 1.5;
	margin: 0;
`;

export const InfoModalFeedbackSection = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const InfoModalFeedbackTextarea = styled.textarea`
	background: ${palette.gray['00']};
	border: 1px solid ${palette.gray['01']};
	border-radius: ${spacing.xs};
	color: ${palette.text.primary};
	font-family: inherit;
	font-size: 13px;
	line-height: 1.5;
	min-height: 72px;
	outline: none;
	padding: ${spacing.small};
	resize: vertical;
	transition: border-color 0.15s;
	width: 100%;

	&:focus {
		border-color: ${palette.primary.main};
	}

	&::placeholder {
		color: ${palette.text.disabled};
	}
`;

export const InfoModalThanks = styled.span`
	color: ${palette.success.main};
	font-size: 13px;
`;

export const InfoModalError = styled.span`
	color: ${palette.error.main};
	font-size: 13px;
`;
