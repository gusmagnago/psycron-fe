import { Box, styled } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledCellWrapper = styled(Box)`
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;

    padding: ${spacing.small} ${spacing.xs};
`;
