import { useState } from 'react';
import { ComingSoonBadge } from '@psycron/components/coming-soon-badge/ComingSoonBadge';
import {
	CheckSuccess,
	Jupiter,
	TriangleAlert,
} from '@psycron/components/icons';

import { AvailabilityMiniCalendar } from './AvailabilityMiniCalendar';
import {
	JupiterEyebrow,
	JupiterIconFrame,
	JupiterMessage,
	JupiterNudge,
	ReadinessCard,
	ReadinessCheck,
	ReadinessCheckIcon,
	ReadinessTitle,
	WorkspaceSwitch,
	WorkspaceToggleDescription,
	WorkspaceToggleRow,
	WorkspaceToggleTitle,
} from './AvailabilityReadinessPanel.styles';
import type { AvailabilityReadinessPanelProps } from './AvailabilityReadinessPanel.types';
import { AvailabilityStatusStrip } from './AvailabilityStatusStrip';

export const AvailabilityReadinessPanel = ({
	activeDate,
	checklistTitle,
	googleChecklistLabel,
	hasGoogleConnected,
	hasSlots,
	jupiterDescription,
	jupiterLabel,
	jupiterSuggestion,
	jupiterToggleLabel,
	slotChecklistLabel,
	statusItems,
	statusTitle,
}: AvailabilityReadinessPanelProps) => {
	const [isJupiterEnabled, setIsJupiterEnabled] = useState(false);

	return (
		<>
			<AvailabilityMiniCalendar activeDate={activeDate} />
			<section
				aria-labelledby='availability-jupiter-toggle-title'
				data-testid='availability-jupiter-toggle-section'
				id='availability-jupiter-toggle-section'
			>
				<WorkspaceToggleRow>
					<div>
						<WorkspaceToggleTitle id='availability-jupiter-toggle-title'>
							{jupiterLabel}
							<ComingSoonBadge
								data-testid='availability-jupiter-coming-soon'
								id='availability-jupiter-coming-soon'
							/>
						</WorkspaceToggleTitle>
						<WorkspaceToggleDescription>
							{jupiterDescription}
						</WorkspaceToggleDescription>
					</div>
					<WorkspaceSwitch
						aria-checked={isJupiterEnabled}
						aria-label={jupiterToggleLabel}
						data-testid='availability-jupiter-toggle'
						disabled
						id='availability-jupiter-toggle'
						isChecked={isJupiterEnabled}
						onClick={() => setIsJupiterEnabled((current) => !current)}
						role='switch'
						type='button'
					/>
				</WorkspaceToggleRow>
			</section>
			{isJupiterEnabled ? (
				<JupiterNudge
					aria-label={jupiterLabel}
					aria-live='polite'
					data-testid='availability-jupiter-nudge'
					id='availability-jupiter-nudge'
				>
					<JupiterIconFrame aria-hidden='true'>
						<Jupiter />
					</JupiterIconFrame>
					<div>
						<JupiterEyebrow>{jupiterLabel}</JupiterEyebrow>
						<JupiterMessage>{jupiterSuggestion}</JupiterMessage>
					</div>
				</JupiterNudge>
			) : null}
			<AvailabilityStatusStrip items={statusItems} title={statusTitle} />
			<ReadinessCard
				aria-labelledby='availability-readiness-checklist-title'
				data-testid='availability-readiness-checklist'
				id='availability-readiness-checklist'
			>
				<ReadinessTitle id='availability-readiness-checklist-title'>
					{checklistTitle}
				</ReadinessTitle>
				<ReadinessCheck
					id='availability-google-checklist'
					data-testid='availability-google-checklist'
				>
					<ReadinessCheckIcon
						aria-hidden='true'
						isWarning={!hasGoogleConnected}
						id='availability-google-checklist-icon'
						data-testid='availability-google-checklist-icon'
					>
						{hasGoogleConnected ? <CheckSuccess /> : <TriangleAlert />}
					</ReadinessCheckIcon>
					<span
						id='availability-google-checklist-label'
						data-testid='availability-google-checklist-label'
					>
						{googleChecklistLabel}
					</span>
				</ReadinessCheck>
				<ReadinessCheck
					id='availability-slots-checklist'
					data-testid='availability-slots-checklist'
				>
					<ReadinessCheckIcon
						aria-hidden='true'
						isWarning={!hasSlots}
						id='availability-slots-checklist-icon'
						data-testid='availability-slots-checklist-icon'
					>
						{hasSlots ? <CheckSuccess /> : <TriangleAlert />}
					</ReadinessCheckIcon>
					<span
						id='availability-slots-checklist-label'
						data-testid='availability-slots-checklist-label'
					>
						{slotChecklistLabel}
					</span>
				</ReadinessCheck>
			</ReadinessCard>
		</>
	);
};
