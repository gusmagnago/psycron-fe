import { forwardRef } from 'react';

import { StyledTypography } from './Text.styles';
import type { ITextProps } from './Text.types';

export const Text = forwardRef<HTMLSpanElement, ITextProps>(
  ({ children, isFirstUpper, ...rest }, ref) => {
    return (
      <StyledTypography ref={ref} isFirstUpper={isFirstUpper} {...rest}>
        {children}
      </StyledTypography>
    );
  }
);

Text.displayName = 'Text';
