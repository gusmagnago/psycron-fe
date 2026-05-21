import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Divider, Typography } from '@mui/material';
import { getPatientById } from '@psycron/api/patient';
import { Button } from '@psycron/components/button/Button';
import { PublicBookingShell } from '@psycron/layouts/public-booking/PublicBookingShell';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

import {
	AgendaLinkBox,
	ConfirmationCard,
	DetailRow,
	PageWrapper,
} from './AppointmentConfirmation.styles';

export const AppointmentConfirmation = () => {
	const { t } = useTranslation();
	const { therapistId, patientId } = useParams<{
		patientId: string;
		therapistId: string;
	}>();

	const { data: patient, isError, isLoading } = useQuery({
		enabled: Boolean(therapistId) && Boolean(patientId),
		queryFn: () => getPatientById(therapistId!, patientId!),
		queryKey: ['publicPatient', therapistId, patientId],
	});

	const agendaUrl = `${window.location.origin}/${window.location.pathname.split('/')[1]}/${patientId}/appointments`;

	const latestSession =
		patient?.sessionDates?.[patient.sessionDates.length - 1];
	const latestSlot = latestSession?.slots?.[0];

	if (isLoading) {
		return (
			<PublicBookingShell>
				<PageWrapper>
					<Typography color='text.secondary'>{t('common.loading')}</Typography>
				</PageWrapper>
			</PublicBookingShell>
		);
	}

	if (isError) {
		return (
			<PublicBookingShell>
				<PageWrapper>
					<Typography color='error' mb={2} variant='h6'>
						{t('booking.confirmation.error.title', 'Something went wrong')}
					</Typography>
					<Typography color='text.secondary' variant='body2'>
						{t(
							'booking.confirmation.error.message',
							'We could not load your booking details. Please contact your practitioner to confirm your appointment.'
						)}
					</Typography>
				</PageWrapper>
			</PublicBookingShell>
		);
	}

	return (
		<PublicBookingShell>
			<PageWrapper>
				<Typography mb={2} variant='h5'>
					{t('booking.confirmation.title')}
				</Typography>
				<Typography color='text.secondary' mb={4} variant='body2'>
					{t('booking.confirmation.subtitle', {
						name: patient?.firstName ?? '',
					})}
				</Typography>

				<ConfirmationCard>
					{latestSession && (
						<>
							<DetailRow>
								<Typography color='text.secondary' variant='caption'>
									{t('booking.confirmation.date')}
								</Typography>
								<Typography variant='body1'>
									{format(parseISO(latestSession.date), 'EEEE, MMMM d, yyyy')}
								</Typography>
							</DetailRow>

							{latestSlot && (
								<DetailRow>
									<Typography color='text.secondary' variant='caption'>
										{t('booking.confirmation.time')}
									</Typography>
									<Typography variant='body1'>
										{latestSlot.startTime} — {latestSlot.endTime}
									</Typography>
								</DetailRow>
							)}
						</>
					)}

					<Divider />

					<DetailRow>
						<Typography color='text.secondary' variant='caption'>
							{t('booking.confirmation.your-agenda')}
						</Typography>
						<Typography color='text.secondary' mb={2} variant='body2'>
							{t('booking.confirmation.agenda-description')}
						</Typography>
						<AgendaLinkBox>
							<Typography variant='body2'>{agendaUrl}</Typography>
						</AgendaLinkBox>
						<Button
							onClick={() => navigator.clipboard.writeText(agendaUrl)}
							variant='outlined'
						>
							{t('booking.confirmation.copy-link')}
						</Button>
					</DetailRow>
				</ConfirmationCard>
			</PageWrapper>
		</PublicBookingShell>
	);
};
