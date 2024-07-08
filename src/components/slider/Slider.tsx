import { Box, Slider as MUISlider, Stack, Typography } from '@mui/material';

import type { ISliderProps } from './Slider.types';

export const Slider = ({
	startIcon,
	endIcon,
	value,
	onChange,
	label,
	...rest
}: ISliderProps) => {
	return (
		<Box>
			{label !== undefined ? (
				<Typography gutterBottom>{label}</Typography>
			) : null}
			<Stack spacing={4} direction='row' alignItems='center'>
				{startIcon ? startIcon : null}
				<MUISlider value={value} onChange={onChange} {...rest} />
				{endIcon ? endIcon : null}
			</Stack>
		</Box>
	);
};
