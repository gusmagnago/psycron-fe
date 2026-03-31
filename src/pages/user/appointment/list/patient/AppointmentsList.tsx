import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
	Divider,
	MenuItem,
	TextField,
	Typography,
} from '@mui/material';
import { getPublicPatientSessions } from '@psycron/api/patient';
import type { IPublicSessionDate, IPublicSessionSlot } from '@psycron/api/patient/index.types';
import { cancelAppointmentByPatient } from '@psycron/api/user/availability';
import type { CancellationReasonEnum } from '@psycron/api/user/availability/index.types';
import { Button } from '@psycron/components/button/Button';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { PublicBookingShell } from '@psycron/layouts/public-booking/PublicBookingShell';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, isPast, parseISO } from 'date-fns';

import {
	CancelForm,
	PageWrapper,
	SectionLabel,
	SessionCard,
	SessionHeader,
} from './AppointmentsList.styles';

const CANCEL_REASONS = [
	{ label: 'booking.cancel.reason.emergency', value: 1 },
	{ label: 'booking.cancel.reason.schedule-conflict', value: 2 },
	{ label: 'booking.cancel.reason.financial', value: 3 },
	{ label: 'booking.cancel.reason.mental-health', value: 4 },
	{ label: 'booking.cancel.reason.other', value: 6 },
] as const;

interface ISessionRow {
	date: string;
	dateId: string;
	isPast: boolean;
	slot: IPublicSessionSlot;
	therapistId: string;
}

export const AppointmentsList = () => {
	const { t } = useTranslation();
	const { patientId } = useParams<{ patientId: string }>();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [cancellingSlotId, setCancellingSlotId] = useState<string | null>(null);
	const [reasonCode, setReasonCode] = useState<number | ''>('');
	const [customReason, setCustomReason] = useState('');

	const { data, isLoading } = useQuery({
		enabled: Boolean(patientId),
		queryFn: () => getPublicPatientSessions(patientId!),
		queryKey: ['publicPatientSessions', patientId],
	});

	const cancelMutation = useMutation({
		mutationFn: ({ slotId, therapistId }: { slotId: string; therapistId: string }) =>
			cancelAppointmentByPatient({
				...(customReason ? { customReason } : {}),
				patientId: patientId!,
				reasonCode: reasonCode as CancellationReasonEnum,
				slotId,
				therapistId,
				triggeredBy: 'PATIENT',
			}),
		onError: () => {
			showAlert({ message: t('booking.cancel.error'), severity: 'error' });
		},
		onSuccess: () => {
			showAlert({ message: t('booking.cancel.success'), severity: 'success' });
			setCancellingSlotId(null);
			setReasonCode('');
			setCustomReason('');
			queryClient.invalidateQueries({ queryKey: ['publicPatientSessions', patientId] });
		},
	});

	const sessions: ISessionRow[] = (data?.patient?.sessionDates ?? []).flatMap(
		(group: IPublicSessionDate) =>
			group.slots.map((slot) => ({
				date: group.date,
				dateId: group._id,
				isPast: isPast(parseISO(group.date)),
				slot,
				therapistId: data!.patient.therapistId,
			}))
	);

	const upcoming = sessions.filter((s) => !s.isPast);
	const past = sessions.filter((s) => s.isPast);

	const renderSession = ({ date, isPast: sessionIsPast, slot, therapistId }: ISessionRow) => {
		const isCancelling = cancellingSlotId === slot._id;

		return (
			<SessionCard isPast={sessionIsPast} key={slot._id}>
				<SessionHeader>
					<Typography variant='subtitle2'>
						{format(parseISO(date), 'EEEE, MMM d, yyyy')}
					</Typography>
					<Typography color='text.secondary' variant='body2'>
						{slot.startTime} — {slot.endTime}
					</Typography>
				</SessionHeader>

				{!sessionIsPast && slot.status !== 'CANCELLED' && (
					<>
						{isCancelling ? (
							<CancelForm>
								<Typography variant='body2'>
									{t('booking.cancel.reason-prompt')}
								</Typography>
								<TextField
									fullWidth
									label={t('booking.cancel.reason-label')}
									onChange={(e) => setReasonCode(Number(e.target.value))}
									select
									size='small'
									value={reasonCode}
								>
									{CANCEL_REASONS.map(({ label, value }) => (
										<MenuItem key={value} value={value}>
											{t(label)}
										</MenuItem>
									))}
								</TextField>
								{reasonCode === 6 && (
									<TextField
										fullWidth
										label={t('booking.cancel.custom-reason')}
										multiline
										onChange={(e) => setCustomReason(e.target.value)}
										rows={2}
										size='small'
										value={customReason}
									/>
								)}
								<Button
									disabled={!reasonCode || cancelMutation.isPending}
									onClick={() =>
										cancelMutation.mutate({ slotId: slot._id, therapistId })
									}
									variant='contained'
								>
									{t('booking.cancel.confirm')}
								</Button>
								<Button
									onClick={() => {
										setCancellingSlotId(null);
										setReasonCode('');
										setCustomReason('');
									}}
									variant='text'
								>
									{t('common.cancel')}
								</Button>
							</CancelForm>
						) : (
							<Button
								onClick={() => setCancellingSlotId(slot._id)}
								variant='outlined'
							>
								{t('booking.cancel.button')}
							</Button>
						)}
					</>
				)}
			</SessionCard>
		);
	};

	if (isLoading) {
		return (
			<PublicBookingShell>
				<PageWrapper>
					<Typography color='text.secondary'>{t('common.loading')}</Typography>
				</PageWrapper>
			</PublicBookingShell>
		);
	}

	return (
		<PublicBookingShell>
			<PageWrapper>
				<Typography mb={1} variant='h5'>
					{t('booking.appointments.title')}
					{data?.patient?.firstName ? `, ${data.patient.firstName}` : ''}
				</Typography>
				<Typography color='text.secondary' mb={5} variant='body2'>
					{t('booking.appointments.subtitle')}
				</Typography>

				{upcoming.length > 0 && (
					<>
						<SectionLabel>{t('booking.appointments.upcoming')}</SectionLabel>
						{upcoming.map(renderSession)}
					</>
				)}

				{upcoming.length === 0 && (
					<Typography color='text.secondary' mb={4} variant='body2'>
						{t('booking.appointments.no-upcoming')}
					</Typography>
				)}

				{past.length > 0 && (
					<>
						<Divider sx={{ my: 4 }} />
						<SectionLabel>{t('booking.appointments.past')}</SectionLabel>
						{past.map(renderSession)}
					</>
				)}
			</PageWrapper>
		</PublicBookingShell>
	);
};
