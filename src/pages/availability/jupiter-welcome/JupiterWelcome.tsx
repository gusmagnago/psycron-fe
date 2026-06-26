import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { JupiterScene } from './jupiter-scene/JupiterScene';
import {
	CharacterWrapper,
	GradientText,
	GreetingText,
	StartButton,
	SubtitleText,
	TitleText,
	WelcomeContainer,
} from './JupiterWelcome.styles';

interface JupiterWelcomeProps {
	onStart: () => void;
}

/**
 * @deprecated The standalone welcome screen was removed (2026-06-26) — onboarding
 * now starts directly in the chat (see GenerateAvailability). Kept for reference /
 * possible revert; not currently rendered anywhere.
 */
export const JupiterWelcome = ({ onStart }: JupiterWelcomeProps) => {
	const { t } = useTranslation();

	return (
		<WelcomeContainer
			data-testid='jupiter-onboarding-welcome'
			id='jupiter-onboarding-welcome'
		>
			<CharacterWrapper>
				<JupiterScene />
			</CharacterWrapper>

			<TitleText>
				<GreetingText>
					{t('jupiter.welcome.title-line1')}
				</GreetingText>
				<Box display='flex' gap={1}>
					<GradientText>
						{t('jupiter.welcome.title-line2')}
					</GradientText>
				</Box>
			</TitleText>

			<SubtitleText>{t('jupiter.welcome.subtitle')}</SubtitleText>

			<StartButton
				data-testid='jupiter-onboarding-welcome-start'
				onClick={onStart}
			>
				{t('jupiter.welcome.cta')}
			</StartButton>
		</WelcomeContainer>
	);
};
