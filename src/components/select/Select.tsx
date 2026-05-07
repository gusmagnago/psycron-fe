import { forwardRef } from 'react';
import type { SelectProps } from '@mui/material';
import { MenuItem } from '@mui/material';
import { ChevronDown } from '@psycron/components/icons';
import { Text } from '@psycron/components/text/Text';

import {
	ControlledWrapper,
	StyledInputLabel,
	StyledMUISelect,
} from './Select.styles';
import type { SelectComponentProps } from './Select.types';

export const Select = forwardRef<
	HTMLSelectElement,
	SelectComponentProps & SelectProps
>(
	(
		{
			customRenderItem,
			disabled,
			hiddenLabel,
			hidePrimaryValue,
			items,
			name,
			onChangeSelect,
			required,
			selectLabel,
			subtitle,
			value,
			width,
		},
		ref
	) => {
		const labelId = `${name}-label`;

		return (
			<ControlledWrapper
				disabled={disabled}
				fullWidth={!width && true}
				required={required}
				width={width}
			>
				{!hiddenLabel && (
					<StyledInputLabel id={labelId}>{selectLabel}</StyledInputLabel>
				)}
				<StyledMUISelect
					aria-label={selectLabel}
					aria-labelledby={labelId}
					fullWidth
					IconComponent={ChevronDown}
					inputRef={ref}
					label={hiddenLabel ? undefined : selectLabel}
					labelId={hiddenLabel ? undefined : labelId}
					name={name}
					onChange={onChangeSelect}
					value={value}
					variant='standard'
				>
					{items?.map((item, index) => (
						<MenuItem
							divider={index !== items.length - 1}
							key={`item-${item.value}-${index}`}
							value={item.value}
						>
							{customRenderItem ? (
								customRenderItem(item)
							) : (
								<>
									{!hidePrimaryValue && (
										<Text variant='caption'>{item.name}</Text>
									)}
									{subtitle && (
										<Text fontSize='0.9rem' pl={2} variant='caption'>
											{item.value}
										</Text>
									)}
								</>
							)}
						</MenuItem>
					))}
				</StyledMUISelect>
			</ControlledWrapper>
		);
	}
);

Select.displayName = 'Select';
