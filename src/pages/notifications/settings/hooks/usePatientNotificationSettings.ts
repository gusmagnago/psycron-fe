import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import type { CustomError } from '@psycron/api/error';
import { getPatientById, updatePatientNotificationPreferences } from '@psycron/api/patient';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface IPatientNotificationSettingsForm {
	appointmentConfirmation: { email: boolean; whatsapp: boolean };
	appointmentUpdated: { email: boolean; whatsapp: boolean };
	calendarInvite: { enabled: boolean };
	reminder: { email: boolean; enabled: boolean; whatsapp: boolean };
}

const DEFAULT: IPatientNotificationSettingsForm = {
	appointmentConfirmation: { email: true, whatsapp: true },
	appointmentUpdated: { email: true, whatsapp: true },
	calendarInvite: { enabled: true },
	reminder: { email: true, enabled: true, whatsapp: true },
};

interface UsePatientNotificationSettingsParams {
	onClose: () => void;
	patientId: string;
	therapistId: string;
}

export const usePatientNotificationSettings = ({
	onClose,
	patientId,
	therapistId,
}: UsePatientNotificationSettingsParams) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const { data: patient, isLoading: isPatientLoading } = useQuery({
		enabled: Boolean(patientId && therapistId),
		gcTime: 1000 * 60 * 10,
		queryFn: () => getPatientById(therapistId, patientId),
		queryKey: ['patientDetails', patientId],
		staleTime: 1000 * 60 * 5,
	});

	const defaultValues = useMemo((): IPatientNotificationSettingsForm => {
		const prefs = patient?.notificationPreferences;
		if (!prefs) return DEFAULT;

		return {
			appointmentConfirmation: {
				email: prefs.appointmentConfirmation.email,
				whatsapp: prefs.appointmentConfirmation.whatsapp,
			},
			appointmentUpdated: {
				email: prefs.appointmentUpdated.email,
				whatsapp: prefs.appointmentUpdated.whatsapp,
			},
			calendarInvite: { enabled: prefs.calendarInvite.enabled },
			reminder: {
				email: prefs.reminder.email,
				enabled: prefs.reminder.enabled,
				whatsapp: prefs.reminder.whatsapp,
			},
		};
	}, [patient?.notificationPreferences]);

	const methods = useForm<IPatientNotificationSettingsForm>({
		defaultValues,
		values: defaultValues,
	});

	const { handleSubmit, setValue, watch } = methods;

	const savePreferencesMutation = useMutation({
		mutationFn: (data: IPatientNotificationSettingsForm) =>
			updatePatientNotificationPreferences(patientId, data),
		onError: (error: CustomError) => {
			capture(PostHogEvent.NotificationSettingsFailed, {
				error_code: error.message ?? 'unknown',
			});
			showAlert({
				message: error.message ?? t('notifications.patient-settings.save-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			showAlert({
				message: t('notifications.patient-settings.save-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['patientDetails', patientId] });
			onClose();
		},
	});

	const onSubmit = handleSubmit((data) => {
		savePreferencesMutation.mutate(data);
	});

	return {
		isLoading: isPatientLoading,
		isSaving: savePreferencesMutation.isPending,
		methods,
		onSubmit,
		patient,
		setValue,
		watch,
	};
};
