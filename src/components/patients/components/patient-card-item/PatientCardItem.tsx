import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Payment } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

import { PatientCardItemWrapper, SmallDivider } from './PatientCardItem.styles';
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
			<Box width={200} p={2}>
				<Typography variant='subtitle1' textAlign='left'>{`${firstName} ${lastName}`}</Typography>
			</Box>
			<SmallDivider orientation='vertical' flexItem />
			<Box width={220} px={2}>
				<Typography variant='body2' textAlign='left'>{appointNamentInfo.next}</Typography>
			</Box>
			<SmallDivider orientation='vertical' flexItem />
			<Box width={40}>
				<Tooltip
					title={`appointment value: ${appointNamentInfo.value} ${appointNamentInfo.currency}`}
				>
					<Payment />
				</Tooltip>
			</Box>
			<SmallDivider orientation='vertical' flexItem />
			<Box width={40} pl={2}>
				<Typography variant='body2'>
					{appointNamentInfo.appointments}
				</Typography>
			</Box>
		</PatientCardItemWrapper>
	);
};
