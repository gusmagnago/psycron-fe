import type { ButtonBaseProps } from '@mui/material';

import { NavButtonStyled } from './AvailabilityNavButton.styles';

interface AvailabilityNavButtonProps extends ButtonBaseProps {
	children: React.ReactNode;
}

export const NavButton = ({
	children,
	...props
}: AvailabilityNavButtonProps) => (
	<NavButtonStyled {...props}>{children}</NavButtonStyled>
);
