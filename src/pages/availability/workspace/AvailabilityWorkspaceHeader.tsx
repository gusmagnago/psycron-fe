import {
	WorkspaceHeaderActions,
	WorkspaceHeaderRoot,
	WorkspaceHeaderSubtitle,
	WorkspaceHeaderTitle,
	WorkspaceHeaderTitleGroup,
} from './AvailabilityWorkspaceHeader.styles';
import type { AvailabilityWorkspaceHeaderProps } from './AvailabilityWorkspaceHeader.types';

export const AvailabilityWorkspaceHeader = ({
	actions,
	actionsLabel,
	subtitle,
	title,
}: AvailabilityWorkspaceHeaderProps) => (
	<WorkspaceHeaderRoot
		data-testid='availability-page-header'
		id='availability-page-header'
	>
		<WorkspaceHeaderTitleGroup
			data-testid='availability-page-header-titles'
			id='availability-page-header-titles'
		>
			<WorkspaceHeaderTitle id='availability-page-title'>
				{title}
			</WorkspaceHeaderTitle>
			{subtitle ? (
				<WorkspaceHeaderSubtitle
					data-testid='availability-page-subtitle'
					id='availability-page-subtitle'
				>
					{subtitle}
				</WorkspaceHeaderSubtitle>
			) : null}
		</WorkspaceHeaderTitleGroup>
		{actions ? (
			<WorkspaceHeaderActions
				aria-label={actionsLabel}
				data-testid='availability-page-header-actions'
				id='availability-page-header-actions'
			>
				{actions}
			</WorkspaceHeaderActions>
		) : null}
	</WorkspaceHeaderRoot>
);
