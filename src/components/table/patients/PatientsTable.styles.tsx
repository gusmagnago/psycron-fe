import {
	Box,
	Divider,
	IconButton,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableRow,
} from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	shadowDisabled,
	shadowMain,
	shadowPress,
} from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const StyledTableBodyCell = styled(TableCell)`
    border-bottom: none;
`;

export const StyledTableBody = styled(TableBody)``;

export const StyledTable = styled(Table)``;

export const StyledTableBodyRow = styled(TableRow)`
    padding: ${spacing.small};
    height: 70px;
    cursor: pointer;

    &:not(:last-child) {
        border: 1px solid red;
    }
    border-radius: 40px;

    margin: 30px;

    &:nth-of-type(2n-1) {
        background-color: ${palette.secondary.main};
    }
`;
