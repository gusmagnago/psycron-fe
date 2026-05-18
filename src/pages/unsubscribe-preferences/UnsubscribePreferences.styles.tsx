import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isBiggerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PageWrapper = styled(Box)`
	min-height: calc(100vh - var(--total-component-height, 0px));
	display: flex;
	align-items: center;
	justify-content: center;
	padding: ${spacing.large};
	background: ${palette.background.default};
`;

export const Card = styled(Box)`
	width: 100%;
	max-width: 480px;
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
`;

export const Heading = styled(Text)`
	font-weight: 700;
	font-size: 1.5rem;
	color: ${palette.text.primary};

	${isBiggerThanTabletMedia} {
		font-size: 2rem;
	}
`;

export const Description = styled(Text)`
	font-size: 0.95rem;
	color: ${palette.text.secondary};
	line-height: 1.6;
`;

export const Disclaimer = styled(Text)`
	font-size: 0.8rem;
	color: ${palette.text.disabled};
	line-height: 1.5;
	padding: ${spacing.small};
	border-left: 3px solid ${palette.gray['02']};
	padding-left: ${spacing.small};
`;

export const SuccessWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.small};
	padding: ${spacing.medium};
	border-radius: 12px;
	background: ${palette.success.light ?? '#e8f5e9'};
`;

export const BackLink = styled('a')`
	font-size: 0.875rem;
	font-weight: 600;
	color: ${palette.secondary.main};
	cursor: pointer;
	text-decoration: none;
	align-self: flex-start;

	&:hover {
		text-decoration: underline;
	}
`;
