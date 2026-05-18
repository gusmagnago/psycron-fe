import { useTranslation } from 'react-i18next';

import { LummiHero } from '../lummi-hero/LummiHero';

import {
	GreetingHeadline,
	GreetingLabel,
	GreetingRoot,
	GreetingTextBlock,
} from './DashboardGreeting.styles';
import type { DashboardGreetingProps } from './DashboardGreeting.types';

const textVariants = {
	hidden: { opacity: 0, x: -12 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const DashboardGreeting = ({
	band,
	imageConfig,
	name,
}: DashboardGreetingProps) => {
	const { t } = useTranslation();

	return (
		<GreetingRoot>
			<LummiHero band={band} imageConfig={imageConfig} size={80} />
			<GreetingTextBlock
				animate='visible'
				initial='hidden'
				variants={textVariants}
			>
				<GreetingLabel>
					{t('page.dashboard.greeting.headline', { name })}
				</GreetingLabel>
				<GreetingHeadline>
					{t(`page.dashboard.greeting.band.${band}`)}
				</GreetingHeadline>
			</GreetingTextBlock>
		</GreetingRoot>
	);
};
