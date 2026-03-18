import { css } from '@emotion/react';
import { Box, styled, Typography } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// ─── Shared styles ────────────────────────────────────────────────────────────

const buttonTransition = css`
	transition: all 200ms ease-out;
`;

// ─── Components ───────────────────────────────────────────────────────────────

export const PreviewCardWrapper = styled(Box)`
	border-radius: ${spacing.small};
	padding: ${spacing.mediumSmall};
	width: 100%;
	align-self: center;

	box-shadow: ${shadowSmall};

	@keyframes previewSlideIn {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	animation: previewSlideIn 300ms ease-out;
`;

export const PreviewTitle = styled(Typography)`
	font-size: 16px;
	font-weight: 700;
	color: ${palette.text.primary};
	margin-bottom: ${spacing.small};
`;

export const PreviewDot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'dotColor',
})<{ dotColor: string }>`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: ${({ dotColor }) => dotColor};
	flex-shrink: 0;
	margin-top: 3px;
`;

export const PreviewRow = styled(Box)`
	display: flex;
	align-items: flex-start;
	gap: ${spacing.xs};
	margin-bottom: ${spacing.xs};
	font-size: 14px;
	line-height: 1.5;
`;

export const PreviewLabel = styled(Typography)`
	font-size: 13px;
	font-weight: 600;
	color: ${palette.text.secondary};
	width: 120px;
	text-align: left;
`;

export const PreviewValue = styled(Typography)`
	font-size: 14px;
	color: ${palette.text.primary};
	text-align: left;
`;

export const PreviewFooter = styled(Typography)`
	font-size: 12px;
	color: ${palette.text.secondary};
	margin-bottom: ${spacing.small};
	margin-top: ${spacing.small};
	text-align: center;
`;

export const ButtonGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const PublishButton = styled(Button)`
	${buttonTransition}

	background-color: ${palette.background.paper};
	border: 2px solid ${palette.brand.purple};

	&:hover {
		background-color: ${palette.brand.dark};
		border-color: ${palette.brand.dark};
		color: ${palette.background.default};
	}

	&:disabled {
		opacity: 0.7;
		background-color: ${palette.background.paper};
		color: ${palette.brand.purple};
	}
`;

export const ResetButton = styled(Button)`
	${buttonTransition}

	&:hover {
		color: ${palette.background.default};
	}
`;
