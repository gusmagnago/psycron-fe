import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { Edit, Payment } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import {
	checkAppointmentTimes,
	formatDateTime,
	getTimeRemaining,
} from '@psycron/utils/variables';

import {
	DashboardCardItemWrapper,
	DashboardCardTooltip,
	GridDivider,
	SmallDivider,
} from './DashboardCardItem.styles';
import type { IDashboarcCardItemProps } from './DashboardCardItem.types';

export const DashboardCardItem = ({
	firstName,
	lastName,
	patientId,
	appointmentInfo,
	isPatientCard,
}: IDashboarcCardItemProps) => {
	const navigate = useNavigate();

	const { lessThanThirtyMinutes } = checkAppointmentTimes(appointmentInfo.next)

	const { t } = useTranslation();

	return (
		<>
			<DashboardCardItemWrapper
				width={'100%'}
				onClick={() => navigate(`patient/${patientId}`)}
				isPatientCard={isPatientCard}
				lessThanThirtyMinutes={!isPatientCard && lessThanThirtyMinutes}
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
							<Typography variant='subtitle1' textAlign='left'>
								{`${firstName} ${lastName}`}
							</Typography>
						</Box>
					</Grid>
					<GridDivider item xs={0.2}>
						<SmallDivider orientation='vertical' flexItem />
					</GridDivider>
					<Grid item xs={2.5}>
						<Box p={2}>
							<DashboardCardTooltip title={'next appointment'}>
								<Typography variant='body2' textAlign='left'>
									{formatDateTime(appointmentInfo.next, t)}
								</Typography>
							</DashboardCardTooltip>
						</Box>
					</Grid>
					<GridDivider item xs={0.2}>
						<SmallDivider orientation='vertical' flexItem />
					</GridDivider>
					<Grid item xs={1} display='flex' justifyContent='center'>
						{isPatientCard ? (
							<Box display='flex' justifyContent='center'>
								<Tooltip
									title={`appointment value: ${appointmentInfo.value} ${appointmentInfo.currency}`}
								>
									<Payment />
								</Tooltip>
							</Box>
						) : (
							<Box p={2}>
								<Typography variant='body2' textAlign='left'>
									{getTimeRemaining(appointmentInfo.next, t)}
								</Typography>
							</Box>
						)}
					</Grid>
					<GridDivider item xs={0.2}>
						<SmallDivider orientation='vertical' flexItem />
					</GridDivider>
					<Grid item xs={1} display='flex' justifyContent='center'>
						<Box display='flex' justifyContent='center'>
							{isPatientCard ? (
								<DashboardCardTooltip title={'monthly appointments'}>
									<Typography variant='body2'>
										{appointmentInfo.appointments}
									</Typography>
								</DashboardCardTooltip>
							) : (
								<Tooltip
									title={'edit appointment'}
									onClick={() =>
										navigate(`/${appointmentInfo.appointmentId}/edit`)
									}
								>
									<Edit />
								</Tooltip>
							)}
						</Box>
					</Grid>
				</Grid>
			</DashboardCardItemWrapper>
		</>
	);
};
