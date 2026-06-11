import { useTranslation } from 'react-i18next';
import {
	CheckSuccess,
	Google,
	TriangleAlert,
} from '@psycron/components/icons';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';

import { AvailabilityReadinessPanel } from './AvailabilityReadinessPanel';
import type { AvailabilityWorkspaceRouteFrameProps } from './AvailabilityWorkspaceRouteFrame.types';
import { AvailabilityWorkspaceShell } from './AvailabilityWorkspaceShell';

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

	const statusItems = [
		{
			badge: hasAvailability
				? t('availability.workspace.badge-on')
				: t('availability.workspace.badge-off'),
			description: hasAvailability
				? t('availability.workspace.status-setup-ready')
				: t('availability.workspace.status-setup-empty'),
			icon: <CheckSuccess />,
			id: 'bookable',
			title: t('availability.workspace.status-setup-title'),
			tone: hasAvailability ? 'success' as const : 'warn' as const,
		},
		{
			badge: '0',
			description: t('availability.workspace.status-conflicts-clear'),
			icon: <TriangleAlert />,
			id: 'conflicts',
			title: t('availability.workspace.status-conflicts-title', { count: 0 }),
			tone: 'success' as const,
		},
		{
			badge: googleConnected
				? t('availability.workspace.badge-live')
				: t('availability.workspace.badge-off'),
			description: googleConnected
				? t('availability.workspace.status-google-connected-desc')
				: t('availability.workspace.status-google-disconnected-desc'),
			icon: <Google />,
			id: 'google',
			title: googleConnected
				? t('availability.workspace.status-google-connected')
				: t('availability.workspace.status-google-disconnected'),
			tone: 'google' as const,
		},
	];

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
