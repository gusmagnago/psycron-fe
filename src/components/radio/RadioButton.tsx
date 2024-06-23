import {
	FormControl,
	FormLabel,
	Radio,
	RadioGroup,
} from '@mui/material';

import { StyledFormControlLabel } from './RadioButton.styles';
import type { IRadioButtonGroup } from './RadioButton.types';

export const RadioButtonGroup = ({
	defaultValue,
	formLabel,
	items,
	row
}: IRadioButtonGroup) => {
	return (
		<FormControl>
			{formLabel ? <FormLabel>{formLabel}</FormLabel> : null}
			<RadioGroup
				defaultValue={defaultValue}
				row={row}
			>
				{items?.map(({ label, value }, index) => (
					<StyledFormControlLabel
						key={`radio-item-${value}-${index}`}
						value={value}
						control={<Radio />}
						label={label}
					/>
				))}
			</RadioGroup>
		</FormControl>
	);
};
