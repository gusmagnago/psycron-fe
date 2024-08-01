import { Divider as MUIDivider } from '@mui/material';

import { SmallDivider } from './Divider.styles';
import type { IDividerProps } from './Divider.types';

export const Divider = ({ small, ...props }: IDividerProps) => {
	return small ? <SmallDivider {...props} /> : <MUIDivider {...props} />;
};
