import { Switch as MUISwitch } from '@mui/material';

import type { ISwitchProps } from '../../SwitchGroup.types';


export const Switch = ({ defaultChecked, small, disabled, required }: ISwitchProps) => {
	return (
		<MUISwitch
			defaultChecked={defaultChecked}
			disabled={disabled}
			required={required}
			size={small ? 'small' : 'medium'}
		/>
	);
};
