import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PageWrapper = styled(Box)`
	max-width: 720px;
	margin: 0 auto;
	padding: ${spacing.medium} ${spacing.small};
`;

export const SessionCard = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isPast',
})<{ isPast?: boolean }>`
	background: ${({ isPast }) => (isPast ? palette.gray['01'] : palette.white)};
	border: 1px solid ${({ isPast }) => (isPast ? palette.gray['02'] : palette.primary.light)};
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	gap: ${spacing.extraSmall};
	margin-bottom: ${spacing.small};
	opacity: ${({ isPast }) => (isPast ? 0.7 : 1)};
	padding: ${spacing.small} ${spacing.mediumSmall};
`;

export const SessionHeader = styled(Box)`
	align-items: center;
	display: flex;
	justify-content: space-between;
`;

export const CancelForm = styled(Box)`
	background: ${palette.error.access};
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	gap: ${spacing.extraSmall};
	margin-top: ${spacing.xs};
	padding: ${spacing.small};
`;

export const SectionLabel = styled(Box)`
	color: ${palette.text.secondary};
	font-size: 0.75rem;
	font-weight: 600;
	letter-spacing: 0.06em;
	margin-bottom: ${spacing.xs};
	text-transform: uppercase;
`;
