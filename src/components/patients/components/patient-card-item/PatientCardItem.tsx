import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { Payment } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

import {
	GridDivider,
	PatientCardItemWrapper,
	SmallDivider,
} from './PatientCardItem.styles';
import type { IPatientCardItemProps } from './PatientCardItem.types';

export const PatientCardItem = ({
	appointNamentInfo,
	firstName,
	lastName,
	patientId,
}: IPatientCardItemProps) => {
	const navigate = useNavigate();

	return (
		<PatientCardItemWrapper
			width={'100%'}
			onClick={() => navigate(`patient/${patientId}`)}
		>
			<Grid
				container
				columns={8}
				justifyContent='space-between'
				alignItems='center'
				width={'100%'}
			>
				<Grid item xs={2.5}>
					<Box display='flex' justifyContent='center' p={2}>
						<Typography
							variant='subtitle1'
							textAlign='left'
						>{`${firstName} ${lastName}`}</Typography>
					</Box>
				</Grid>
				<GridDivider item xs={0.2}>
					<SmallDivider orientation='vertical' flexItem />
				</GridDivider>
				<Grid item xs={2.5}>
					<Box p={2}>
						<Typography variant='body2' textAlign='left'>
							{appointNamentInfo.next}
						</Typography>
					</Box>
				</Grid>
				<GridDivider item xs={0.2}>
					<SmallDivider orientation='vertical' flexItem />
				</GridDivider>
				<Grid item xs={1}>
					<Box>
						<Tooltip
							title={`appointment value: ${appointNamentInfo.value} ${appointNamentInfo.currency}`}
						>
							<Payment />
						</Tooltip>
					</Box>
				</Grid>
				<GridDivider item xs={0.2}>
					<SmallDivider orientation='vertical' flexItem />
				</GridDivider>
				<Grid item xs={1}>
					<Box>
						<Typography variant='body2'>
							{appointNamentInfo.appointments}
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</PatientCardItemWrapper>
	);
};
