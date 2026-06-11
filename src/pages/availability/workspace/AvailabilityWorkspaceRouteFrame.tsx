import { useTranslation } from 'react-i18next';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';

import { AvailabilityReadinessPanel } from './AvailabilityReadinessPanel';
import type { AvailabilityWorkspaceRouteFrameProps } from './AvailabilityWorkspaceRouteFrame.types';
import { AvailabilityWorkspaceShell } from './AvailabilityWorkspaceShell';
import { useAvailabilityStatusItems } from './useAvailabilityStatusItems';

export const AvailabilityWorkspaceRouteFrame = ({
	children,
	isLoading = false,
	subtitle,
	title,
}: AvailabilityWorkspaceRouteFrameProps) => {
	const { t } = useTranslation();
	const { availability } = useJupiterAvailabilityConfig();
	const googleConnected = Boolean(availability?.googleCalendarConnected);
	const hasAvailability = Boolean(availability);

	const statusItems = useAvailabilityStatusItems({
		googleConnected,
		hasAvailability,
	});

	return (
		<AvailabilityWorkspaceShell
			contentMode='page'
			isLoading={isLoading}
			panel={
				<AvailabilityReadinessPanel
					activeDate={new Date()}
					checklistTitle={t('availability.workspace.checklist-title')}
					googleChecklistLabel={
						googleConnected
							? t('availability.workspace.checklist-google-connected')
							: t('availability.workspace.checklist-google-missing')
					}
					hasGoogleConnected={googleConnected}
					hasSlots={hasAvailability}
					jupiterDescription={t('availability.workspace.jupiter-description')}
					jupiterLabel={t('availability.workspace.jupiter-label')}
					jupiterSuggestion={t('availability.workspace.jupiter-suggestion')}
					jupiterToggleLabel={t('availability.workspace.jupiter-toggle-label')}
					slotChecklistLabel={
						hasAvailability
							? t('availability.workspace.checklist-setup-ready')
							: t('availability.workspace.checklist-setup-empty')
					}
					statusItems={statusItems}
					statusTitle={t('availability.workspace.status-title')}
				/>
			}
			subtitle={subtitle}
			title={title}
		>
			{children}
		</AvailabilityWorkspaceShell>
	);
};
