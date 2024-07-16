import { Button as MUIButton } from '@mui/material';

import type { IButtonProps } from './Button.types';

export const Button = ({
  secondary,
  tertiary,
  onClick,
  children,
  small,
  fullWidth,
}: IButtonProps) => {
  const bttnColor = () => {
    switch (true) {
      case secondary:
        return 'secondary';
      case tertiary:
        return 'tertiary';
      default:
        return 'primary';
    }
  };

  return (
    <MUIButton
      color={bttnColor()}
      variant={secondary ? 'outlined' : 'contained'}
      size={small ? 'small' : 'medium'}
      onClick={onClick}
      fullWidth={fullWidth}
    >
      {children}
    </MUIButton>
  );
};
