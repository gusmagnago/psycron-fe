import { css } from '@emotion/react';
import { FormControlLabel, styled } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';

import type { ISwitchGroupProps } from './SwitchGroup.types';

export const SwitchControlLabel = styled(FormControlLabel, {
	shouldForwardProp: (prop) => prop !== 'small',
})<Pick<ISwitchGroupProps, 'small'>>`
    .MuiFormControlLabel-asterisk {
        color: ${palette.secondary.main};
    }
    .MuiFormControlLabel-label {
        ${({ small }) =>
		small &&
            css`
                font-size: 0.9em;
            `}
        &::first-letter {
            text-transform: uppercase;
        }
    }
`;
