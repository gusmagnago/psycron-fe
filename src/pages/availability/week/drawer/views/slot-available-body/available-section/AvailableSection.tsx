import {
	SectionHeader,
	SectionLabel,
	SectionWrapper,
} from '../SlotAvailableBody.styles';

import type { AvailableSectionProps } from './AvailableSection.types';

export const AvailableSection = ({
	children,
	icon,
	title,
}: AvailableSectionProps) => (
	<SectionWrapper>
		<SectionHeader>
			{icon}
			<SectionLabel>{title}</SectionLabel>
		</SectionHeader>
		{children}
	</SectionWrapper>
);
