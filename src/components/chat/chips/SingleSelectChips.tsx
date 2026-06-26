import { useState } from 'react';

import { ChipButton, ChipsContainer,ChipsFadeOut } from './ChatChips.styles';
import type { ISingleSelectChipsProps } from './ChatChips.types';

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
			data-testid={testIdPrefix ? `${testIdPrefix}-chips` : undefined}
			id={testIdPrefix ? `${testIdPrefix}-chips` : undefined}
		>
			{options.map((option) => (
				<ChipButton
					key={option.key}
					chipVariant={option.variant}
					onClick={() => handleSelect(option.key)}
					disabled={disabled}
					data-testid={
						testIdPrefix ? `${testIdPrefix}-chip-${option.key}` : undefined
					}
					id={testIdPrefix ? `${testIdPrefix}-chip-${option.key}` : undefined}
				>
					{option.icon}
					{option.label}
				</ChipButton>
			))}
		</ChipsContainer>
	);
};
