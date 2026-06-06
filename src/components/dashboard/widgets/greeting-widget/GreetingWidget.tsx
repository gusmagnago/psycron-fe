import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	BentoTileChromeContext,
	type BentoTileChromeState,
} from '@psycron/components/dashboard/bento-tile/BentoTile.context';
import { LummiHero } from '@psycron/components/dashboard/lummi-hero/LummiHero';
import { JupiterInsightsWidget } from '@psycron/components/dashboard/widgets/jupiter-insights-widget/JupiterInsightsWidget';
import { useWeather } from '@psycron/hooks/useWeather';
import { getDateLocale } from '@psycron/utils/date/date.utils';
import { format } from 'date-fns';

import {
	GreetingCopy,
	GreetingEyebrow,
	GreetingHead,
	GreetingHeadline,
	GreetingSubtext,
	GreetingWidgetRoot,
	JupiterIconBox,
	JupiterPanel,
	JupiterPanelFooter,
	JupiterPanelHeader,
	JupiterPanelIdentity,
} from './GreetingWidget.styles';
import type { GreetingWidgetProps } from './GreetingWidget.types';

const textVariants = {
	hidden: { opacity: 0, x: -12 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const iconFloatAnimate = { y: [0, -4, 0] };
const iconFloatTransition = {
	duration: 4,
	ease: 'easeInOut',
	repeat: Infinity,
	repeatType: 'loop' as const,
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

	// Isolated context — JupiterInsightsWidget's WidgetLayout deposits
	// its chrome here instead of the parent BentoTile's context.
	const [jupChrome, setJupChrome] = useState<BentoTileChromeState>({});
	const jupCtx = useMemo(() => ({ setChrome: setJupChrome }), []);

	const hasJupHeader = Boolean(jupChrome.icon || jupChrome.title || jupChrome.headerActions);
	const hasJupFooter = Boolean(jupChrome.footer || jupChrome.actions);

	return (
		<GreetingWidgetRoot>
			<GreetingHead>
				<LummiHero band={band} size={72} weather={weather} />
				<GreetingCopy animate='visible' initial='hidden' variants={textVariants}>
					<GreetingEyebrow>
						{t(`page.dashboard.greeting.band.${band}`)},
					</GreetingEyebrow>
					<GreetingHeadline>{name}</GreetingHeadline>
					<GreetingSubtext>
						{dateLabel} · {subtext}
					</GreetingSubtext>
				</GreetingCopy>
			</GreetingHead>

			<JupiterPanel>
				<BentoTileChromeContext.Provider value={jupCtx}>
					{hasJupHeader && (
						<JupiterPanelHeader>
							<JupiterPanelIdentity>
								{jupChrome.icon && (
									<JupiterIconBox
										animate={iconFloatAnimate}
										transition={iconFloatTransition}
									>
										{jupChrome.icon}
									</JupiterIconBox>
								)}
								{jupChrome.title}
							</JupiterPanelIdentity>
							{jupChrome.headerActions}
						</JupiterPanelHeader>
					)}
					<JupiterInsightsWidget compact insights={insights} isLoading={isLoading} />
					{hasJupFooter && (
						<JupiterPanelFooter>
							{jupChrome.footer}
							{jupChrome.actions}
						</JupiterPanelFooter>
					)}
				</BentoTileChromeContext.Provider>
			</JupiterPanel>
		</GreetingWidgetRoot>
	);
};
