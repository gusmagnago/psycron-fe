import styled from '@emotion/styled';
import { FormControl } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ControlledWrapper = styled(FormControl)<{ width?: string }>`
    .MuiInputLabel-root {
        padding: ${spacing.small};
        margin-left: 0;
    }
    width: ${({ width }) => width};
`;
