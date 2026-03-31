import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexHover } from '@psycron/theme/zIndex';

// spacing.medium (24px top offset) + padding xs*2 (16px) + logo height (50px)
export const PUBLIC_TOP_BAR_BOTTOM = '110px';

export const ShellWrapper = styled(Box)`
	position: relative;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	padding: 0 ${spacing.medium};
	margin-top: ${spacing.medium};

	${isMobileMedia} {
		padding: 0 ${spacing.xs};
	}
`;

export const TopBar = styled(Box)`
	align-items: center;

	display: flex;

	backdrop-filter: blur(10px);
	border: 2px solid rgba(233, 214, 255, 0.1);

	border-radius: ${spacing.mediumSmall};
	justify-content: space-between;
	padding: ${spacing.xs} ${spacing.medium};
	position: sticky;
	top: ${spacing.medium};
	z-index: ${zIndexHover};
	box-shadow: ${shadowSmall};
`;

export const LogoMark = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};

	& > svg {
		height: 3.125rem;
		width: auto;
	}
`;

export const Content = styled(Box)`
	flex: 1;
`;

export const FooterBar = styled(Box)`
	align-items: center;
	border-top: 1px solid ${palette.gray['01']};
	display: flex;
	justify-content: center;
	gap: ${spacing.xs};
	padding: ${spacing.small} ${spacing.medium};

	& > svg {
		height: 20px;
		width: auto;
	}
`;
