import { useState } from 'react';
import { Button } from '@psycron/components/button/Button';
import {
	CheckSuccess,
	Jupiter,
	TriangleAlert,
} from '@psycron/components/icons';

import {
	ReadinessActions,
	ReadinessBody,
	ReadinessCard,
	ReadinessCheck,
	ReadinessCheckIcon,
	ReadinessJupiterAnswer,
	ReadinessNote,
	ReadinessTitle,
} from './AvailabilityReadinessPanel.styles';
import type { AvailabilityReadinessPanelProps } from './AvailabilityReadinessPanel.types';

export const AvailabilityReadinessPanel = ({
	askJupiterLabel,
	checklistTitle,
	googleChecklistLabel,
	hasGoogleConnected,
	hasSlots,
	jupiterAnswer,
	jupiterLabel,
	pwaNote,
	resolveLabel,
	slotChecklistLabel,
}: AvailabilityReadinessPanelProps) => {
	const [isJupiterAnswerVisible, setIsJupiterAnswerVisible] = useState(false);

	return (
		<>
			<ReadinessCard
				aria-labelledby='availability-publish-checklist-title'
				data-testid='availability-publish-checklist'
				id='availability-publish-checklist'
			>
				<ReadinessTitle id='availability-publish-checklist-title'>
					{checklistTitle}
				</ReadinessTitle>
				<ReadinessCheck>
					<ReadinessCheckIcon aria-hidden='true' isWarning={!hasGoogleConnected}>
						{hasGoogleConnected ? <CheckSuccess /> : <TriangleAlert />}
					</ReadinessCheckIcon>
					<span>{googleChecklistLabel}</span>
				</ReadinessCheck>
				<ReadinessCheck>
					<ReadinessCheckIcon aria-hidden='true' isWarning={!hasSlots}>
						{hasSlots ? <CheckSuccess /> : <TriangleAlert />}
					</ReadinessCheckIcon>
					<span>{slotChecklistLabel}</span>
				</ReadinessCheck>
			</ReadinessCard>
			<ReadinessNote
				data-testid='availability-pwa-readiness-note'
				id='availability-pwa-readiness-note'
			>
				{pwaNote}
			</ReadinessNote>
			<ReadinessActions>
				{isJupiterAnswerVisible ? (
					<ReadinessJupiterAnswer
						aria-label={jupiterLabel}
						aria-live='polite'
						data-testid='availability-jupiter-answer'
						id='availability-jupiter-answer'
					>
						<ReadinessTitle>{jupiterLabel}</ReadinessTitle>
						<ReadinessBody>{jupiterAnswer}</ReadinessBody>
					</ReadinessJupiterAnswer>
				) : null}
				<Button
					fullWidth
					tertiary
					data-testid='availability-resolve-readiness-button'
					id='availability-resolve-readiness-button'
					variant='contained'
				>
					<TriangleAlert />
					{resolveLabel}
				</Button>
				<Button
					fullWidth
					tertiary
					aria-checked={isJupiterAnswerVisible}
					aria-controls='availability-jupiter-answer'
					data-testid='availability-ask-jupiter-button'
					id='availability-ask-jupiter-button'
					onClick={() => setIsJupiterAnswerVisible((current) => !current)}
					role='switch'
					variant='outlined'
				>
					<Jupiter />
					{askJupiterLabel}
				</Button>
			</ReadinessActions>
		</>
	);
};
