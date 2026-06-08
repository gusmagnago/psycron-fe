import { useJupiterInsightsPresentation } from '@psycron/components/dashboard/widgets/jupiter-insights-widget/JupiterInsightsWidget.presentation';

import {
	JupiterIconBox,
	JupiterPanel,
	JupiterPanelFooter,
	JupiterPanelHeader,
	JupiterPanelIdentity,
} from './GreetingWidget.styles';
import type { GreetingJupiterPanelProps } from './GreetingWidget.types';

const iconFloatAnimate = { y: [0, -4, 0] };
const iconFloatTransition = {
	duration: 4,
	ease: 'easeInOut',
	repeat: Infinity,
	repeatType: 'loop' as const,
};

export const GreetingJupiterPanel = ({
	insights,
	isLoading,
}: GreetingJupiterPanelProps) => {
	const { actions, body, footer, icon, title } = useJupiterInsightsPresentation({
		compact: true,
		insights,
		isLoading,
	});
	const hasHeader = Boolean(icon || title);
	const hasFooter = Boolean(footer || actions);

	return (
		<JupiterPanel
			data-testid='dashboard-greeting-jupiter-panel'
			id='dashboard-greeting-jupiter-panel'
		>
			{hasHeader && (
				<JupiterPanelHeader
					data-testid='dashboard-greeting-jupiter-header'
					id='dashboard-greeting-jupiter-header'
				>
					<JupiterPanelIdentity
						data-testid='dashboard-greeting-jupiter-identity'
						id='dashboard-greeting-jupiter-identity'
					>
						{icon && (
							<JupiterIconBox
								animate={iconFloatAnimate}
								data-testid='dashboard-greeting-jupiter-icon'
								id='dashboard-greeting-jupiter-icon'
								transition={iconFloatTransition}
							>
								{icon}
							</JupiterIconBox>
						)}
						{title}
					</JupiterPanelIdentity>
				</JupiterPanelHeader>
			)}
			{body}
			{hasFooter && (
				<JupiterPanelFooter>
					{footer}
					{actions}
				</JupiterPanelFooter>
			)}
		</JupiterPanel>
	);
};
