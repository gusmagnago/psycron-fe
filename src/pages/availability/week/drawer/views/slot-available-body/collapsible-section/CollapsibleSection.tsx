import { useId, useState } from 'react';
import { ChevronDown } from '@psycron/components/icons';

import { SectionLabel } from '../SlotAvailableBody.styles';

import {
	ChevronWrapper,
	CollapsibleContent,
	CollapsibleWrapper,
	MotionCollapse,
	ToggleHeader,
} from './CollapsibleSection.styles';
import type { CollapsibleSectionProps } from './CollapsibleSection.types';

export const CollapsibleSection = ({
	children,
	defaultOpen = false,
	icon,
	title,
}: CollapsibleSectionProps) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const contentId = useId();

	return (
		<CollapsibleWrapper>
			<ToggleHeader
				type='button'
				aria-controls={contentId}
				aria-expanded={isOpen}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				{icon}
				<SectionLabel>{title}</SectionLabel>
				<ChevronWrapper isOpen={isOpen}>
					<ChevronDown />
				</ChevronWrapper>
			</ToggleHeader>
			<MotionCollapse
				id={contentId}
				initial={false}
				animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
				aria-hidden={!isOpen}
			>
				<CollapsibleContent>{children}</CollapsibleContent>
			</MotionCollapse>
		</CollapsibleWrapper>
	);
};
