import { useState } from 'react';
import { Jupiter } from '@psycron/components/icons';

import {
	JupiterEyebrow,
	JupiterIconFrame,
	JupiterMessage,
	JupiterNudge,
	WorkspaceSwitch,
	WorkspaceToggleDescription,
	WorkspaceToggleRow,
	WorkspaceToggleTitle,
} from './AvailabilityControlsPanel.styles';
import type { AvailabilityControlsPanelProps } from './AvailabilityControlsPanel.types';
import { AvailabilityMiniCalendar } from './AvailabilityMiniCalendar';
import { AvailabilitySourceList } from './AvailabilitySourceList';
import { AvailabilityStatusStrip } from './AvailabilityStatusStrip';

export const AvailabilityControlsPanel = ({
	activeDate,
	jupiterDescription,
	jupiterLabel,
	jupiterSuggestion,
	jupiterToggleLabel,
	sourceItems,
	sourcesTitle,
	statusItems,
	statusTitle,
}: AvailabilityControlsPanelProps) => {
	const [isJupiterEnabled, setIsJupiterEnabled] = useState(true);

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
						</WorkspaceToggleTitle>
						<WorkspaceToggleDescription>
							{jupiterDescription}
						</WorkspaceToggleDescription>
					</div>
					<WorkspaceSwitch
						aria-checked={isJupiterEnabled}
						aria-label={jupiterToggleLabel}
						data-testid='availability-jupiter-toggle'
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
			<AvailabilitySourceList items={sourceItems} title={sourcesTitle} />
		</>
	);
};
