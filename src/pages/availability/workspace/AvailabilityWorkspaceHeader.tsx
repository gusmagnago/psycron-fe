import {
	WorkspaceHeaderActions,
	WorkspaceHeaderRoot,
	WorkspaceHeaderSubtitle,
	WorkspaceHeaderTitle,
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
		<div>
			<WorkspaceHeaderTitle id='availability-page-title'>
				{title}
			</WorkspaceHeaderTitle>
			{subtitle ? <WorkspaceHeaderSubtitle>{subtitle}</WorkspaceHeaderSubtitle> : null}
		</div>
		{actions ? (
			<WorkspaceHeaderActions aria-label={actionsLabel}>
				{actions}
			</WorkspaceHeaderActions>
		) : null}
	</WorkspaceHeaderRoot>
);
