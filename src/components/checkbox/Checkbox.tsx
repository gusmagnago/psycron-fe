import type { RefObject} from 'react';
import { forwardRef } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox as MUICheckbox } from '@mui/material';

import { StyledFormControlLabel } from './Checkbox.styles';
import type { ICheckboxProps } from './Checkbox.types';

export const Checkbox = forwardRef(<T extends FieldValues>({
	labelKey,
	register,
	registerName,
	onChange,
	value,
}: ICheckboxProps<T>, ref: ((instance: HTMLButtonElement | null) => void) | RefObject<HTMLButtonElement> | null | undefined) => {
	const { t } = useTranslation();

	return (
		<StyledFormControlLabel
			control={<MUICheckbox ref={ref}/>}
			label={t(labelKey)}
			onChange={onChange}
			value={value}
			{...(register ? register(registerName as Path<T>) : null)}
		/>
	);
});

Checkbox.displayName = 'Checkbox';