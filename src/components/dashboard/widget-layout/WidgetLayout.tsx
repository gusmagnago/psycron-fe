import type { ReactElement } from 'react';
import { useBentoTileChrome } from '@psycron/components/dashboard/bento-tile/BentoTile.context';

import { WidgetLayoutRoot } from './WidgetLayout.styles';
import type { WidgetLayoutProps } from './WidgetLayout.types';

export const WidgetLayout = ({
	actions,
	body,
	expandedContent,
	footer,
	headerActions,
	icon,
	title,
}: WidgetLayoutProps): ReactElement => {
	useBentoTileChrome({ actions, expandedContent, footer, headerActions, icon, title });

	return <WidgetLayoutRoot>{body}</WidgetLayoutRoot>;
};
