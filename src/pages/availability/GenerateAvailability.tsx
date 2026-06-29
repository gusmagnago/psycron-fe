import { useTranslation } from 'react-i18next';

import { JupiterConversation } from './jupiter-conversation/JupiterConversation';
import { AvailabilityWorkspaceRouteFrame } from './workspace/AvailabilityWorkspaceRouteFrame';
import { GenerateAvailabilityContentWrapper } from './GenerateAvailability.styles';

// The standalone welcome screen (JupiterWelcome) was removed — onboarding now
// starts directly in the chat. The conversation's first bot message is the
// greeting, and resume is handled by useJupiterFlow via the saved draft.
export const GenerateAvailability = () => {
	const { t } = useTranslation();

	return (
		<AvailabilityWorkspaceRouteFrame
			contentMode='chat'
			subtitle={t('availability.generate.workspace-subtitle')}
			title={t('availability.generate.workspace-title')}
		>
			<GenerateAvailabilityContentWrapper data-testid='jupiter-onboarding-content'>
				<JupiterConversation />
			</GenerateAvailabilityContentWrapper>
		</AvailabilityWorkspaceRouteFrame>
	);
};
