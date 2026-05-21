import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import { Divider } from '@psycron/components/divider/Divider';
import { Payment } from '@psycron/components/icons';
import { Text } from '@psycron/components/text/Text';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { PATIENTS } from '@psycron/pages/urls';
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

	const { t, i18n } = useTranslation();

	return (
		<>
			<DashboardCardItemWrapper
				width={'100%'}
				onClick={() => navigate(`/${i18n.language}/${PATIENTS}/${patientId}`)}
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
					<Grid size={2.5}>
						<Box display='flex' justifyContent='center' p={2}>
							<Typography variant='subtitle1' textAlign='left'>
								{`${firstName} ${lastName}`}
							</Typography>
						</Box>
					</Grid>
					<GridDivider size={0.2}>
						<Divider small orientation='vertical' flexItem />
					</GridDivider>
					<Grid size={2.5}>
						<Box p={2}>
							<DashboardCardTooltip title={'next appointment'}>
								<Typography variant='body2' textAlign='left'>
									{formatDateTime(appointmentInfo.next, t)}
								</Typography>
							</DashboardCardTooltip>
						</Box>
					</Grid>
					<GridDivider size={0.2}>
						<Divider small orientation='vertical' flexItem />
					</GridDivider>
					<Grid size={1} display='flex' justifyContent='center'>
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
					<GridDivider size={0.2}>
						<Divider small orientation='vertical' flexItem />
					</GridDivider>
					<Grid size={1} display='flex' justifyContent='center'>
						<Box display='flex' justifyContent='center'>
							{isPatientCard && (
							<DashboardCardTooltip title={'monthly appointments'}>
								<Typography variant='body2'>
									{appointmentInfo.appointments}
								</Typography>
							</DashboardCardTooltip>
						)}
						</Box>
					</Grid>
				</Grid>
			</DashboardCardItemWrapper>
		</>
	);
};
