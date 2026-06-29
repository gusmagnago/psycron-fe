import { useState } from 'react';

import { ChipButton, ChipsContainer, ChipsFadeOut } from './ChatChips.styles';
import type { ISingleSelectChipsProps } from './ChatChips.types';
import { chipTestId } from './chatChips.utils';

export const SingleSelectChips = ({
	options,
	onSelect,
	disabled = false,
	testIdPrefix,
}: ISingleSelectChipsProps) => {
	const [selected, setSelected] = useState<string | null>(null);

	const handleSelect = (key: string) => {
		if (disabled || selected) return;
		setSelected(key);

		setTimeout(() => {
			onSelect(key);
		}, 200);
	};

	if (selected) {
		return <ChipsFadeOut />;
	}

	return (
		<ChipsContainer
			data-testid={chipTestId(testIdPrefix, 'chips')}
			id={chipTestId(testIdPrefix, 'chips')}
		>
			{options.map((option) => (
				<ChipButton
					key={option.key}
					chipVariant={option.variant}
					onClick={() => handleSelect(option.key)}
					disabled={disabled}
					data-testid={chipTestId(testIdPrefix, `chip-${option.key}`)}
					id={chipTestId(testIdPrefix, `chip-${option.key}`)}
				>
					{option.icon}
					{option.label}
				</ChipButton>
			))}
		</ChipsContainer>
	);
};
