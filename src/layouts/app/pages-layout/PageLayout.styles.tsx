import styled from '@emotion/styled';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexSticky } from '@psycron/theme/zIndex';

export const PageLayoutWrapper = styled('div')`
	display: flex;
	flex-direction: column;
	height: 100vh;
	height: 100dvh;
	min-height: 0;
	overflow-x: hidden;
	overflow-y: hidden;
`;

export const PageTitleWrapper = styled('div')`
	align-items: center;
	background: ${palette.background.default};
	display: flex;
	flex-shrink: 0;
	gap: ${spacing.medium};
	height: auto;
	justify-content: space-between;
	position: sticky;
	top: 0;
	z-index: ${zIndexSticky};

	${isMobileMedia} {
		gap: ${spacing.small};
		padding: ${spacing.xs} 0;
	}
`;

export const PageTitleContent = styled('div')`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${spacing.xxs};
	min-width: 0;
`;

export const PageTitleNavigation = styled('div')`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

export const PageTitleActions = styled('div')`
	align-items: center;
	display: flex;
	flex-shrink: 0;
	justify-content: flex-end;
`;

export const PageTitle = styled('h1')`
	color: ${palette.text.primary};
	font-size: 1.4rem;
	font-weight: 600;
	line-height: 1.25;
	margin: 0;
	overflow-wrap: anywhere;
	text-align: left;
`;

export const PageSubTitleWrapper = styled('div')`
	padding-top: ${spacing.xs};
`;

export const PageSubTitle = styled('p')`
	color: ${palette.text.secondary};
	font-size: 0.9rem;
	font-weight: 400;
	margin: 0;
	padding: 0 ${spacing.xs};
	text-align: left;

	${isMobileMedia} {
		font-size: 0.8rem;
	}
`;

export const PageLoaderWrapper = styled('div')`
	align-items: center;
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: center;
`;

export const PageChildrenWrapper = styled('div')`
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
	padding: ${spacing.small};
	padding-top: 0;
	scrollbar-gutter: stable;

	${isMobileMedia} {
		padding: ${spacing.xs};
		padding-top: 0;
	}
`;

export const PageContent = styled('div')`
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 0;
`;
