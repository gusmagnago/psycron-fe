import { Box } from '@mui/material';
import { Divider } from '@psycron/components/divider/Divider';

import { tableBones } from '../../utils';
import { TableCell } from '../table-cell/TableCell';

import {
	StyledRow,
	TableBodyRow,
	TableBodyRowItem,
	TableBodyWrapper,
} from './TableBody.styles';
import type { ITableBodyProps } from './TableBody.types';

export const TableBody = ({ bodyItems }: ITableBodyProps) => {
	return (
		<Box mt={5}>
			<Box minHeight={530}>
				{bodyItems.map((row, rowIndex) => (
					<TableBodyWrapper
						container
						columns={row.length}
						key={`table-row-${rowIndex}`}
					>
						<StyledRow>
							{row.map(
								({ icon, numeric, label, action, isPatients, id }, index) => (
									<TableBodyRowItem
										key={`table-cell-${rowIndex}-${index}`}
										item
										xs={tableBones(action, index)}
									>
										<TableBodyRow>
											<TableCell
												icon={icon}
												label={label}
												numeric={numeric}
												action={action}
												isPatients={isPatients}
												id={id}
											/>
											{index !== row.length - 1 ? <Divider small /> : null}
										</TableBodyRow>
									</TableBodyRowItem>
								)
							)}
						</StyledRow>
						{rowIndex !== bodyItems.length - 1 ? (
							<Box width={'100%'} my={2}>
								<Divider small />
							</Box>
						) : null}
					</TableBodyWrapper>
				))}
			</Box>
		</Box>
	);
};
