import type { SelectProps as SlctComponentProps } from '@mui/material';
import { InputLabel, MenuItem, Select as SlctComponent, Typography } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { ChevronDown } from 'lucide-react';

import { ControlledWrapper } from './Select.styles';
import type { SelectProps } from './Select.types';

export const Select = ({
	items,
	onChangeSelect,
	selectLabel,
	value,
	required,
	disabled,
	subtitle,
	width,
	name
}: SelectProps & SlctComponentProps) => {
	return (
		<ControlledWrapper required={required} fullWidth={!width && true} disabled={disabled} width={width}>
			<InputLabel>{selectLabel}</InputLabel>
			<SlctComponent
				variant='standard'
				value={value}
				label={selectLabel}
				defaultValue={name}
				onChange={onChangeSelect}
				IconComponent={ChevronDown}
				fullWidth
			>
				{items?.map(({ name, value }, index) => (
					<MenuItem value={value} divider={index !== items.length - 1} key={`item-${name}-${value}`}>
						{name} {subtitle ? (<Typography variant='caption' color={palette.text.secondary}>{value}</Typography>) : null}
					</MenuItem>
				))}
			</SlctComponent>
		</ControlledWrapper>
	);
};
