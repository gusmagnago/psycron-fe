import { Box, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover } from '@psycron/theme/zIndex';

export const AppLayoutDividerMobilePadding = `${spacing.small}`;

export const NavBarWrapper = styled(Box)`
	z-index: ${zIndexHover};
	display: flex;
	flex-direction: column;

	${isBiggerThanMediumMedia} {
		flex-direction: row;
	}
`;

export const Content = styled(Box)`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	padding-top: ${spacing.medium};
	padding: 0;
	padding-left: 0;

	overflow-y: hidden;
	overflow-x: hidden;

	position: relative;
	justify-content: space-between;

	${isBiggerThanMediumMedia} {
		margin-top: 0;
	}
`;

export const LayoutWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100vh;
	justify-content: flex-start;
	padding: ${spacing.small};

	overflow: hidden;

	${isBiggerThanMediumMedia} {
		flex-direction: row;
		padding: ${spacing.medium} ${spacing.small};
	}
`;

export const DividerWrapper = styled(Box)`
	padding-right: 0;
	padding-bottom: ${AppLayoutDividerMobilePadding};

	${isBiggerThanMediumMedia} {
		padding-right: ${spacing.small};
		padding-bottom: 0;
	}
`;

export const BackofficeFooter = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	p {
		font-size: 0.8rem;
	}

	${isBiggerThanMediumMedia} {
		flex-direction: row;
	}
`;

export const BackofficeFooterEmail = styled(Text)`
	padding-left: ${spacing.xxs};
	color: ${palette.brand.purple};
	font-weight: 500;
`;

export const BackOfficeErrorWrapper = styled(Box)`
	display: flex;
	height: 100%;
	width: 100%;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

export const BackOfficeNoWorkerError = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	gap: ${spacing.small};
`;
