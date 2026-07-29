import { Link } from '@psycron/components/link/Link';
import { NavigateLink } from '@psycron/components/link/navigate/NavigateLink';
import { Loader } from '@psycron/components/loader/Loader';

import {
	PageChildrenWrapper,
	PageContent,
	PageLayoutWrapper,
	PageLoaderWrapper,
	PageSubTitle,
	PageSubTitleWrapper,
	PageTitle,
	PageTitleActions,
	PageTitleContent,
	PageTitleNavigation,
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
	idPrefix = 'page-layout',
	link,
	linkName,
}: IPageLayout) => {
	return (
		<PageLayoutWrapper
			data-testid={`${idPrefix}-layout`}
			id={`${idPrefix}-layout`}
		>
			<PageChildrenWrapper
				data-scroll-region='page'
				data-testid={`${idPrefix}-scroll-region`}
				id={`${idPrefix}-scroll-region`}
			>
				{title ? (
					<PageTitleWrapper
						data-testid={`${idPrefix}-header`}
						id={`${idPrefix}-header`}
					>
						<PageTitleContent
							data-testid={`${idPrefix}-title-content`}
							id={`${idPrefix}-title-content`}
						>
							<PageTitle
								data-testid={`${idPrefix}-title`}
								id={`${idPrefix}-title`}
							>
								{title}
							</PageTitle>
							{backButton || link ? (
								<PageTitleNavigation
									data-testid={`${idPrefix}-navigation`}
									id={`${idPrefix}-navigation`}
								>
									{backButton ? <NavigateLink isBack to={backTo} /> : null}
									{link ? <Link to={link}>{linkName}</Link> : null}
								</PageTitleNavigation>
							) : null}
						</PageTitleContent>
						{actions ? (
							<PageTitleActions
								data-testid={`${idPrefix}-actions-slot`}
								id={`${idPrefix}-actions-slot`}
							>
								{actions}
							</PageTitleActions>
						) : null}
					</PageTitleWrapper>
				) : null}
				{subTitle ? (
					<PageSubTitleWrapper
						data-testid={`${idPrefix}-subtitle-wrapper`}
						id={`${idPrefix}-subtitle-wrapper`}
					>
						<PageSubTitle
							data-testid={`${idPrefix}-subtitle`}
							id={`${idPrefix}-subtitle`}
						>
							{subTitle}
						</PageSubTitle>
					</PageSubTitleWrapper>
				) : null}
				<PageContent
					data-testid={`${idPrefix}-content`}
					id={`${idPrefix}-content`}
				>
					{isLoading ? (
						<PageLoaderWrapper
							data-testid={`${idPrefix}-loader`}
							id={`${idPrefix}-loader`}
						>
							<Loader />
						</PageLoaderWrapper>
					) : (
						children
					)}
				</PageContent>
			</PageChildrenWrapper>
		</PageLayoutWrapper>
	);
};
