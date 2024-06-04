import type {
	SelectProps as SlctComponentProps} from '@mui/material';
import {
	InputLabel,
	MenuItem,
	Select as SlctComponent,
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

import { ControlledWrapper } from './Select.styles';
import type { SelectProps } from './Select.types';

export const Select = ({
	items,
	onChangeSelect,
	selectLabel,
	value,
	required
}: SelectProps & SlctComponentProps) => {
	return (
		<ControlledWrapper required={required} fullWidth>
			<InputLabel id='demo-simple-select-label'>{selectLabel}</InputLabel>
			<SlctComponent
				labelId='demo-simple-select-label'
				id='demo-simple-select'
				variant='standard'
				value={value}
				label={selectLabel}
				onChange={onChangeSelect}
				IconComponent={ChevronDown}
				fullWidth
			>
				{items.map(({ name, value }, index) => (
					<>
						<MenuItem value={value} divider={index !== items.length -1}>
							{name}
						</MenuItem>
					</>
				))}
			</SlctComponent>
		</ControlledWrapper>
	);
};
