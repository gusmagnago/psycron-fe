import styled from '@emotion/styled';
import { Box, Card as MUICard } from '@mui/material';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const CardWrapper = styled(MUICard, {
	shouldForwardProp: (props) => props !== 'isModal',
})<{ isModal?: boolean }>`
	box-shadow: ${shadowSmall};
	margin: ${spacing.mediumSmall} ${spacing.small};
`;

export const Content = styled(Box)`
	min-height: 5rem;
	text-align: left;

	padding-bottom: ${spacing.space};
	padding-top: ${spacing.small};

	${isBiggerThanMediumMedia} {
		padding-bottom: ${spacing.small};
		padding-top: ${spacing.medium};
	}
`;
