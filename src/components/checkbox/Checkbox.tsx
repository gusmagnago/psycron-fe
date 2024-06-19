import type { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox as MUICheckbox, FormControlLabel } from '@mui/material';

import type { ICheckboxProps } from './Checkbox.types';

export const Checkbox = <T extends FieldValues>({
	labelKey,
	register,
	registerName,
	onChange,
	value,
}: ICheckboxProps<T>) => {
	const { t } = useTranslation();

	return (
		<FormControlLabel
			control={<MUICheckbox />}
			label={t(labelKey)}
			onChange={onChange}
			value={value}
			{...(register ? register(registerName as Path<T>) : null)}
		/>
	);
};
