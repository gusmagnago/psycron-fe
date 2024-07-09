import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { Divider } from '@psycron/components/divider/Divider';
import { Edit, Payment } from '@psycron/components/icons';
import { Text } from '@psycron/components/text/Text';
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
} from './DashboardCardItem.styles';
import type { IDashboarcCardItemProps } from './DashboardCardItem.types';

export const DashboardCardItem = ({
	firstName,
	lastName,
	patientId,
	appointmentInfo,
	isPatientCard,
	paused,
}: IDashboarcCardItemProps) => {
	const navigate = useNavigate();

	const { lessThanThirtyMinutes, isNow } = checkAppointmentTimes(
		appointmentInfo.next,
		appointmentInfo.duration
	);

	const { t } = useTranslation();

	return (
		<>
			<DashboardCardItemWrapper
				width={'100%'}
				onClick={() => navigate(`patient/${patientId}`)}
				isPatientCard={isPatientCard}
				lessThanThirtyMinutes={!isPatientCard && lessThanThirtyMinutes}
				isNow={isNow}
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
						<Divider small orientation='vertical' flexItem />
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
						<Divider small orientation='vertical' flexItem />
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
								<Text variant='body2' textAlign='left' isFirstUpper>
									{getTimeRemaining(appointmentInfo.next, t, !paused)}
								</Text>
							</Box>
						)}
					</Grid>
					<GridDivider item xs={0.2}>
						<Divider small orientation='vertical' flexItem />
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
