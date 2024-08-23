import type { Ref } from 'react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox as MUICheckbox } from '@mui/material';

import { StyledFormControlLabel } from './Checkbox.styles';
import type { ICheckboxProps } from './Checkbox.types';

export const Checkbox = forwardRef(
	({ labelKey, register }: ICheckboxProps, ref: Ref<HTMLInputElement>) => {
		const { t } = useTranslation();

		return (
			<StyledFormControlLabel
				control={<MUICheckbox inputRef={ref} {...register} />}
				label={t(labelKey)}
			/>
		);
	}
);

Checkbox.displayName = 'Checkbox';
