import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';

import { useJupiterInsightsPresentation } from './JupiterInsightsWidget.presentation';
import type { JupiterInsightsWidgetProps } from './JupiterInsightsWidget.types';

export const JupiterInsightsWidget = ({
	compact,
	insights,
	isLoading,
}: JupiterInsightsWidgetProps) => {
	const { actions, body, expandedContent, footer, icon, title } =
		useJupiterInsightsPresentation({ compact, insights, isLoading });

	return (
		<WidgetLayout
			actions={actions}
			body={body}
			expandedContent={expandedContent}
			footer={footer}
			icon={icon}
			title={title}
		/>
	);
};
