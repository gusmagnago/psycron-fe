import { ChevronLeft, ChevronRight } from '@psycron/components/icons';

import {
	QueueFiltersSection,
	QueueFiltersToggleButton,
	QueueFiltersToggleContent,
	QueueFiltersToggleSubtitle,
	QueueFiltersToggleTitle,
} from '../styles/QueuePanel.styles';
import type { QueueFiltersTriggerProps } from '../types/QueuePanel.types';

export const QueueFiltersTrigger = ({
	activeFilterCount,
	controlsId,
	isOpen,
	onOpen,
	summaryActive,
	summaryDefault,
	title,
}: QueueFiltersTriggerProps) => (
	<QueueFiltersSection>
		<QueueFiltersToggleButton
			aria-controls={controlsId}
			aria-expanded={isOpen}
			aria-haspopup='dialog'
			onClick={onOpen}
			type='button'
		>
			<QueueFiltersToggleContent>
				<QueueFiltersToggleTitle>{title}</QueueFiltersToggleTitle>
				<QueueFiltersToggleSubtitle>
					{activeFilterCount > 0 ? summaryActive : summaryDefault}
				</QueueFiltersToggleSubtitle>
			</QueueFiltersToggleContent>
			{isOpen ? <ChevronLeft /> : <ChevronRight />}
		</QueueFiltersToggleButton>
	</QueueFiltersSection>
);
