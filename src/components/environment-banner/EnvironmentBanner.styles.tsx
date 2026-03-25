import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowMediumError } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover } from '@psycron/theme/zIndex';

export const Banner = styled(Box)`
	width: 50%;

	display: flex;
	flex-direction: column;
	background-color: ${palette.error.light};
	border: 1px solid ${palette.error.main};
	padding: ${spacing.xs};

	border-radius: ${spacing.mediumLarge};
	position: absolute;
	z-index: ${zIndexHover};
	right: 0;
	bottom: 0;

	margin: 0 10px 10px 0;

	box-shadow: ${shadowMediumError};

	${isMobileMedia} {
		width: 100%;
	}
`;

export const BannerHeader = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: ${spacing.small};
`;

export const IconWrapper = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const Actions = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.xs};
`;

export const Content = styled(Box)`
	padding-top: ${spacing.xxs};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;
