import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { JupiterConversation } from './jupiter-conversation/JupiterConversation';
import { STORAGE_KEY } from './jupiter-conversation/useJupiterFlow';
import { JupiterWelcome } from './jupiter-welcome/JupiterWelcome';
import { AvailabilityWorkspaceRouteFrame } from './workspace/AvailabilityWorkspaceRouteFrame';
import { GenerateAvailabilityContentWrapper } from './GenerateAvailability.styles';

type JupiterPhase = 'welcome' | 'conversation';

const hasSavedFlow = (): boolean => {
	try {
		return !!localStorage.getItem(STORAGE_KEY);
	} catch {
		return false;
	}
};

export const GenerateAvailability = () => {
	const { t } = useTranslation();
	const [phase, setPhase] = useState<JupiterPhase>(
		hasSavedFlow() ? 'conversation' : 'welcome'
	);

	const handleStart = () => {
		setPhase('conversation');
	};

	if (phase === 'welcome') {
		return (
			<AvailabilityWorkspaceRouteFrame
				subtitle={t('availability.generate.workspace-subtitle')}
				title={t('availability.generate.workspace-title')}
			>
				<JupiterWelcome onStart={handleStart} />
			</AvailabilityWorkspaceRouteFrame>
		);
	}

	return (
		<AvailabilityWorkspaceRouteFrame
			subtitle={t('availability.generate.workspace-subtitle')}
			title={t('availability.generate.workspace-title')}
		>
			<GenerateAvailabilityContentWrapper>
				<JupiterConversation />
			</GenerateAvailabilityContentWrapper>
		</AvailabilityWorkspaceRouteFrame>
	);
};
