import { useTranslation } from 'react-i18next';
import { LummiHero } from '@psycron/components/dashboard/lummi-hero/LummiHero';

import {
	GreetingCopy,
	GreetingEyebrow,
	GreetingHeadline,
	GreetingWidgetRoot,
} from './GreetingWidget.styles';
import type { GreetingWidgetProps } from './GreetingWidget.types';

const textVariants = {
	hidden: { opacity: 0, x: -12 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const GreetingWidget = ({
	band,
	name,
}: GreetingWidgetProps) => {
	const { t } = useTranslation();

	return (
		<GreetingWidgetRoot>
			<LummiHero band={band} size={72} />
			<GreetingCopy animate='visible' initial='hidden' variants={textVariants}>
				<GreetingEyebrow>
					{t('page.dashboard.greeting.headline', { name })}
				</GreetingEyebrow>
				<GreetingHeadline>
					{t(`page.dashboard.greeting.band.${band}`)}
				</GreetingHeadline>
			</GreetingCopy>
		</GreetingWidgetRoot>
	);
};
