import type { SyntheticEvent } from 'react';

import {
	SectionTabButton,
	SectionTabsWrapper,
	StyledSectionTabs,
} from './SectionTabs.styles';
import type { SectionTabsProps } from './SectionTabs.types';

export const SectionTabs = <Value extends string,>({
	ariaLabel,
	items,
	onChange,
	value,
}: SectionTabsProps<Value>) => {
	const handleChange = (_event: SyntheticEvent, nextValue: Value): void => {
		onChange(nextValue);
	};

	return (
		<SectionTabsWrapper>
			<StyledSectionTabs
				aria-label={ariaLabel}
				onChange={handleChange}
				value={value}
			>
				{items.map((item) => (
					<SectionTabButton
						data-testid={item.testId}
						disabled={item.disabled}
						key={item.value}
						label={item.label}
						value={item.value}
					/>
				))}
			</StyledSectionTabs>
		</SectionTabsWrapper>
	);
};
