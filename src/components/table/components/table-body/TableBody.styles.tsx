import { Box, Grid, styled } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const TableBodyWrapper = styled(Grid)`
    align-items: center;
`;

export const TableBodyRow = styled(Box)`
    display: flex;
    height: 50px;
    margin-bottom: ${spacing.mediumSmall};
`;

export const TableBodyRowItem = styled(Grid)``;
