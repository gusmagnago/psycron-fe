import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const PublicLayoutWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 100%;
	justify-content: flex-start;
`;

export const PublicLayoutContent = styled(Box)`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 0;
	z-index: 2;
`;

export const FooterWrapper = styled(Box)`
	position: relative;
	padding: 0 ${spacing.large} ${spacing.small};
	z-index: 2;
	height: var(--footer-height);

	display: flex;
	align-items: center;
	justify-content: center;
`;

export const FooterContent = styled(Box)`
	display: flex;
	align-items: center;
	flex-direction: column;
`;

export const StyledFooterTex = styled(Text)`
	display: flex;
	margin-bottom: ${spacing.small};
	flex-direction: row;
	width: 100%;
	justify-content: center;

	${isMobileMedia} {
		flex-direction: column;
		align-items: center;
	}
`;
