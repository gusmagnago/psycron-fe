import { SectionWrapper } from '../SlotBookedBody.styles';

import { SectionHeader, SectionLabel } from './SlotBookedSection.styles';
import type { BookedSectionTypes } from './SlotBookedSection.types';

export const BookedSection = ({
	children,
	icon,
	title,
}: BookedSectionTypes) => (
	<SectionWrapper>
		<SectionHeader>
			{icon}
			<SectionLabel>{title}</SectionLabel>
		</SectionHeader>
		{children}
	</SectionWrapper>
);
