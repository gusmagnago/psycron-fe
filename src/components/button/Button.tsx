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
	variant,
	...props
}: IButtonProps) => {
	const resolvedColor = () => {
		if (severity) return severity;
		if (tertiary) return 'tertiary';
		if (secondary) return 'secondary';
		return 'primary';
	};

	const resolvedVariant = () => {
		if (variant) return variant;
		if (severity || secondary || tertiary) return 'outlined';
		return 'contained';
	};

	return (
		<MUIButton
			{...props}
			color={resolvedColor()}
			variant={resolvedVariant()}
			size={small ? 'small' : 'medium'}
			type={type}
			fullWidth={fullWidth}
			disabled={loading || props.disabled}
			onClick={onClick}
		>
			<StyledBttnContentWrapper>
				{loading ? (
					<BttnLoader size={25} color='secondary' thickness={5} />
				) : null}
				{children}
			</StyledBttnContentWrapper>
		</MUIButton>
	);
};
