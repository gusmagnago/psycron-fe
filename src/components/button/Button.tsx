import { Button as MUIButton } from '@mui/material';

import { BttnLoader, StyledBttnContentWrapper } from './Button.styles';
import type { IButtonProps } from './Button.types';

export const Button = ({
	secondary,
	severity,
	tertiary,
	onClick,
	children,
	small,
	fullWidth,
	type,
	loading,
	...props
}: IButtonProps) => {
	const bttnColor = () => {
		if (severity) return severity;
		if (tertiary) return 'tertiary';
		if (secondary) return 'secondary';
		return 'primary';
	};

	const bttnVariant = () => {
		if (severity || secondary || tertiary) return 'outlined';
		return 'contained';
	};

	return (
		<MUIButton
			color={bttnColor()}
			variant={bttnVariant()}
			size={small ? 'small' : 'medium'}
			type={type}
			fullWidth={fullWidth}
			disabled={loading}
			onClick={onClick}
			{...props}
		>
			<StyledBttnContentWrapper>
				{loading && <BttnLoader size={25} color='secondary' thickness={5} />}
				{children}
			</StyledBttnContentWrapper>
		</MUIButton>
	);
};
