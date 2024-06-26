import { Switch as MUISwitch } from '@mui/material';

import { SwitchControlLabel } from '../../SwitchGroup.styles';
import type { ISwitchProps } from '../../SwitchGroup.types';

export const Switch = ({
	defaultChecked,
	small,
	disabled,
	required,
	label,
	onChange,
}: ISwitchProps) => {
	return (
		<SwitchControlLabel
			control={
				<MUISwitch
					checked={defaultChecked}
					disabled={disabled}
					required={required}
					size={small ? 'small' : 'medium'}
					onChange={onChange}
				/>
			}
			label={label}
			small={small}
			required={required}
			disabled={disabled}
		/>
	);
};
