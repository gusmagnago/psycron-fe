import { css } from '@emotion/react';
import { GlobalStyles } from '@mui/material';

const globalStyles = (
	<GlobalStyles
		styles={css`
      .Mui-disabled {
        cursor: not-allowed !important;
      }

      .disabled {
        cursor: not-allowed !important;
      }
    `}
	/>
);

export default globalStyles;
