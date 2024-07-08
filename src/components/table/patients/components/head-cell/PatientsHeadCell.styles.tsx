import { Box, styled, TableCell, TableRow } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledTableCell = styled(TableCell)`
    padding: ${spacing.small} 0;
    height: 80px;
    border-bottom: none;
`;

export const CellContentWrapper = styled(Box)`
    display: flex;
    align-items: stretch;
    height: 100%;
    padding-left: ${spacing.small};
`;

export const StyledTableHeadRow = styled(TableRow)`
    margin-bottom: ${spacing.mediumLarge};
`;
