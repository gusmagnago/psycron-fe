import { forwardRef } from 'react';
import type { SelectChangeEvent, SelectProps } from '@mui/material';
import {
	InputLabel,
	MenuItem,
	Select as MuiSelect,
	Typography,
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

import { ControlledWrapper } from './Select.styles';
import type { SelectComponentProps } from './Select.types';

export const Select = forwardRef<
  HTMLSelectElement,
  SelectComponentProps & SelectProps
>(
	(
		{
			items,
			onChangeSelect,
			selectLabel,
			value,
			required,
			disabled,
			subtitle,
			width,
			name,
		},
		ref
	) => (
		<ControlledWrapper
			required={required}
			fullWidth={!width && true}
			disabled={disabled}
			width={width}
		>
			<InputLabel>{selectLabel}</InputLabel>
			<MuiSelect
				variant='standard'
				value={value}
				label={selectLabel}
				defaultValue={name}
				onChange={
          onChangeSelect as (event: SelectChangeEvent<string | number>) => void
				}
				IconComponent={ChevronDown}
				fullWidth
				inputRef={ref}
			>
				{items?.map(({ name, value }, index) => (
					<MenuItem
						value={value}
						divider={index !== items.length - 1}
						key={`item-${name}-${value}`}
					>
						{name}{' '}
						{subtitle ? (
							<Typography variant='caption'>{value}</Typography>
						) : null}
					</MenuItem>
				))}
			</MuiSelect>
		</ControlledWrapper>
	)
);

Select.displayName = 'Select';
