import { forwardRef } from 'react';
import type { SelectChangeEvent, SelectProps } from '@mui/material';
import { MenuItem, Select as MuiSelect, Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';

import { ControlledWrapper, StyledInputLabel } from './Select.styles';
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
	) => {
		const labelId = `${name}-label`;

		return (
			<ControlledWrapper
				required={required}
				fullWidth={!width && true}
				disabled={disabled}
				width={width}
			>
				<StyledInputLabel id={labelId}>{selectLabel}</StyledInputLabel>
				<MuiSelect
					variant='standard'
					name={name}
					value={value}
					labelId={labelId}
					label={selectLabel}
					aria-labelledby={labelId}
					aria-label={selectLabel}
					onChange={
						onChangeSelect as (
							event: SelectChangeEvent<string | number>
						) => void
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
							{name}
							{subtitle ? (
								<Typography variant='caption'>{value}</Typography>
							) : null}
						</MenuItem>
					))}
				</MuiSelect>
			</ControlledWrapper>
		);
	}
);

Select.displayName = 'Select';
