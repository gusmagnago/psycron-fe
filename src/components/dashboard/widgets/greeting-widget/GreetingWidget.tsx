import { useTranslation } from 'react-i18next';
import { LummiHero } from '@psycron/components/dashboard/lummi-hero/LummiHero';
import { useWeather } from '@psycron/hooks/useWeather';
import { getDateLocale } from '@psycron/utils/date/date.utils';
import { format } from 'date-fns';

import { GreetingJupiterPanel } from './GreetingJupiterPanel';
import {
	GreetingCopy,
	GreetingEyebrow,
	GreetingHead,
	GreetingHeadline,
	GreetingSubtext,
	GreetingWidgetRoot,
	WeatherMeta,
} from './GreetingWidget.styles';
import type { GreetingWidgetProps } from './GreetingWidget.types';

const textVariants = {
	hidden: { opacity: 0, x: -12 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const GreetingWidget = ({
	band,
	insights,
	isLoading,
	name,
	sessionCount,
}: GreetingWidgetProps) => {
	const { i18n, t } = useTranslation();
	const weather = useWeather();

	const dateLabel = format(new Date(), 'EEEE, d MMMM', {
		locale: getDateLocale(i18n.language),
	});

	const subtext =
		sessionCount !== undefined && sessionCount > 0
			? t('page.dashboard.greeting.subtext-sessions', { count: sessionCount })
			: t('page.dashboard.greeting.subtext');

	return (
		<GreetingWidgetRoot
			aria-labelledby='dashboard-greeting-name'
			role='region'
			data-testid='dashboard-greeting-card'
			id='dashboard-greeting-card'
		>
			<GreetingHead
				data-testid='dashboard-greeting-head'
				id='dashboard-greeting-head'
			>
				<LummiHero
					band={band}
					size={72}
					status={weather.status}
					weatherIconBaseUri={weather.iconBaseUri}
					weather={weather.type}
				/>
				<GreetingCopy
					animate='visible'
					data-testid='dashboard-greeting-copy'
					id='dashboard-greeting-copy'
					initial='hidden'
					variants={textVariants}
				>
					<GreetingEyebrow
						data-testid='dashboard-greeting-band'
						id='dashboard-greeting-band'
					>
						{t(`page.dashboard.greeting.band.${band}`)},
					</GreetingEyebrow>
					<GreetingHeadline
						data-testid='dashboard-greeting-name'
						id='dashboard-greeting-name'
					>
						{name}
					</GreetingHeadline>
					<GreetingSubtext
						data-testid='dashboard-greeting-subtext'
						id='dashboard-greeting-subtext'
					>
						{dateLabel} · {subtext}
					</GreetingSubtext>
					<WeatherMeta
						aria-live='polite'
						data-testid='dashboard-greeting-weather-meta'
						id='dashboard-greeting-weather-meta'
					>
						{t(`page.dashboard.greeting.weather.${weather.type}`)}
						{' · '}
						{t(`page.dashboard.greeting.weather-source.${weather.provider}`)}
					</WeatherMeta>
				</GreetingCopy>
			</GreetingHead>

			<GreetingJupiterPanel insights={insights} isLoading={isLoading} />
		</GreetingWidgetRoot>
	);
};
