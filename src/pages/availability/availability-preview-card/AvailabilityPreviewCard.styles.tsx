import { Box, styled, Typography } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowMediumPurple,
	shadowSmall,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// ─── Components ───────────────────────────────────────────────────────────────

// Matches the preview's BoxShellAtom: white card, 18px radius, soft shadow,
// flex column with a tight gap.
export const PreviewCardWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	width: 100%;
	padding: ${spacing.small};
	border-radius: 18px;
	background: ${palette.white};
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

export const PreviewHeader = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${spacing.xs};
`;

// Matches the preview's BoxTitle (14px / 700).
export const PreviewTitle = styled(Typography)`
	font-size: 14px;
	font-weight: 700;
	color: ${palette.text.primary};
	margin: 0;
`;

// Matches the preview's StatusPillAtom.
export const PreviewStatusPill = styled(Box)`
	display: inline-flex;
	align-items: center;
	min-height: 26px;
	padding: 3px 9px;
	border-radius: 999px;
	background-color: ${palette.brand.light};
	color: ${palette.brand.purple};
	font-size: 11px;
	font-weight: 800;
	line-height: 1.2;
	white-space: nowrap;
	box-shadow: ${shadowSmall};
`;

export const PreviewDot = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'dotColor',
})<{ dotColor: string }>`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-color: ${({ dotColor }) => dotColor};
	flex-shrink: 0;
`;

// Matches the preview's PreviewRowAtom: center-aligned, 13px.
export const PreviewRow = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
	font-size: 13px;
`;

export const PreviewLabel = styled(Typography)`
	min-width: 96px;
	font-size: 13px;
	color: ${palette.text.secondary};
	text-align: left;
`;

export const PreviewValue = styled(Typography)`
	font-size: 13px;
	font-weight: 600;
	color: ${palette.text.primary};
	text-align: left;
`;

// Matches the preview's BoxMuted footer.
export const PreviewFooter = styled(Typography)`
	font-size: 12px;
	color: ${palette.text.secondary};
	margin: 0;
	text-align: left;
`;

// Matches the preview's PublishGroup.
export const ButtonGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	margin-top: ${spacing.xxs};
`;

// Matches the preview's PreviewPublishButton: purple pill with purple shadow;
// gray when blocked; purple at 0.82 opacity while publishing; success green with
// no shadow once published.
export const PublishButton = styled(Button)`
	height: 42px;
	padding: 0 ${spacing.mediumSmall};
	border: none;
	border-radius: 40px;
	background-color: ${palette.brand.purple};
	color: ${palette.white};
	font-size: 14px;
	font-weight: 600;
	text-transform: none;
	box-shadow: ${shadowMediumPurple};
	transition: background 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;

	&:hover {
		background-color: ${palette.brand.dark};
		color: ${palette.white};
	}

	&:disabled {
		background-color: ${palette.gray['04']};
		box-shadow: ${shadowSmall};
		color: ${palette.white};
		cursor: not-allowed;
	}

	&[data-publish-state='publishing']:disabled {
		background-color: ${palette.brand.purple};
		box-shadow: ${shadowMediumPurple};
		opacity: 0.82;
	}

	&[data-publish-state='success']:disabled {
		background-color: ${palette.success.main};
		box-shadow: none;
		color: ${palette.white};
		opacity: 1;
	}
`;

// Matches the preview's PreviewResetButton: transparent pill, tertiary text.
export const ResetButton = styled(Button)`
	height: 42px;
	padding: 0 ${spacing.mediumSmall};
	border: none;
	border-radius: 40px;
	background-color: transparent;
	color: ${palette.tertiary.main};
	font-size: 13px;
	font-weight: 600;
	text-transform: none;

	&:hover {
		background-color: transparent;
		color: ${palette.tertiary.main};
	}
`;
