import { Typography } from '@mui/material';

import type { IAddressInfoItemProps } from './AddressInfoItem.types';

export const AddressInfoItem = ({ value }: IAddressInfoItemProps) => {
	if (!value) return null;

	return (
		<Typography variant='body2' pb={1}>
			{value}
		</Typography>
	);
};
