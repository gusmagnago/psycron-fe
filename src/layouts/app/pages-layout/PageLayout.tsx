import { Box } from '@mui/material';
import { Link } from '@psycron/components/link/Link';
import { NavigateLink } from '@psycron/components/link/navigate/NavigateLink';
import { Loader } from '@psycron/components/loader/Loader';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import {
	PageChildrenWrapper,
	PageLayoutWrapper,
	PageLoaderWrapper,
	PageSubTitle,
	PageTitle,
	PageTitleActions,
	PageTitleContent,
	PageTitleWrapper,
} from './PageLayout.styles';
import type { IPageLayout } from './PageLayout.types';

export const PageLayout = ({
	actions,
	title,
	children,
	isLoading,
	subTitle,
	backButton,
	backTo,
	link,
	linkName,
}: IPageLayout) => {
	return (
		<PageLayoutWrapper>
			{title ? (
				<PageTitleWrapper>
					<PageTitleContent>
						<PageTitle>{title}</PageTitle>
						{subTitle ? (
							<Box pt={spacing.xs}>
								<PageSubTitle>{subTitle}</PageSubTitle>
							</Box>
						) : null}
						{backButton ? <NavigateLink isBack to={backTo} /> : null}
						{String(link) ? <Link to={link}>{linkName}</Link> : null}
					</PageTitleContent>
					{actions ? <PageTitleActions>{actions}</PageTitleActions> : null}
				</PageTitleWrapper>
			) : null}
			{isLoading ? (
				<PageLoaderWrapper>
					<Loader />
				</PageLoaderWrapper>
			) : (
				<PageChildrenWrapper>{children}</PageChildrenWrapper>
			)}
		</PageLayoutWrapper>
	);
};
