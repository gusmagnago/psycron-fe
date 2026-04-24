import { Drawer } from '@psycron/components/drawer/Drawer';

import { QueueFiltersToggleSubtitle } from '../styles/QueuePanel.styles';
import type { QueueFiltersDrawerProps } from '../types/QueuePanel.types';

export const QueueFiltersDrawer = ({
	activeFilterCount,
	ariaLabel,
	children,
	isOpen,
	onClose,
	summaryActive,
	summaryDefault,
	title,
}: QueueFiltersDrawerProps) => {
	if (!isOpen) return null;

	return (
		<Drawer
			ariaLabel={ariaLabel}
			headerExtra={
				<QueueFiltersToggleSubtitle>
					{activeFilterCount > 0 ? summaryActive : summaryDefault}
				</QueueFiltersToggleSubtitle>
			}
			onClose={onClose}
			title={title}
		>
			{children}
		</Drawer>
	);
};
