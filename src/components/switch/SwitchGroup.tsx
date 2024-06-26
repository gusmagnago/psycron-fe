import { FormGroup } from '@mui/material';

import { Switch } from './components/item/Switch';
import { SwitchControlLabel } from './SwitchGroup.styles';
import type { ISwitchGroupProps } from './SwitchGroup.types';

export const SwitchGroup = ({ items, small }: ISwitchGroupProps) => {
	return (
		<FormGroup>
			{items?.map(({ label, required, disabled, defaultChecked }, index) => (
				<SwitchControlLabel
					key={`switch-item-${index}`}
					control={<Switch defaultChecked={defaultChecked} small={small}/>}
					label={label}
					small={small}
					required={required}
					disabled={disabled}
				/>
			))}
		</FormGroup>
	);
};
