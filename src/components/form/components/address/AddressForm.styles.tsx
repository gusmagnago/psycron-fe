import { styled, TextField } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ComplementaryField = styled(TextField)`
    * > input {
        border: 2px solid ${palette.secondary.main};
        border-radius: calc(2 * ${spacing.mediumSmall});
        padding: ${spacing.extraSmall};
    }
`;
