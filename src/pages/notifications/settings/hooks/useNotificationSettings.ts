import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import type { CustomError } from '@psycron/api/error';
import { updateNotificationPreferences } from '@psycron/api/notifications';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	DEFAULT_NOTIFICATION_SETTINGS,
	type INotificationSettingsForm,
} from '../NotificationSettingsPage.types';

export const useNotificationSettings = ({ onClose }: { onClose: () => void }) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const { userDetails, therapistId, isUserDetailsLoading } = useUserDetails();

	const defaultValues = useMemo((): INotificationSettingsForm => {
		const prefs = userDetails?.notificationPreferences;
		if (!prefs) return DEFAULT_NOTIFICATION_SETTINGS;

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
				leadTimeMinutes: prefs.reminder.leadTimeMinutes,
				whatsapp: prefs.reminder.whatsapp,
			},
		};
	}, [userDetails?.notificationPreferences]);

	const methods = useForm<INotificationSettingsForm>({
		defaultValues,
		values: defaultValues,
	});

	const { handleSubmit, watch, setValue } = methods;

	const reminderEnabled = watch('reminder.enabled');

	const savePreferencesMutation = useMutation({
		mutationFn: (data: INotificationSettingsForm) =>
			updateNotificationPreferences(therapistId, data),
		onSuccess: (_data, variables) => {
			capture(PostHogEvent.NotificationSettingsSaved, {
				calendar_invite_enabled: variables.calendarInvite.enabled,
				confirmation_email: variables.appointmentConfirmation.email,
				confirmation_whatsapp: variables.appointmentConfirmation.whatsapp,
				reminder_enabled: variables.reminder.enabled,
				reminder_lead_time_minutes: variables.reminder.leadTimeMinutes,
			});

			showAlert({
				message: t('notifications.settings.save-success'),
				severity: 'success',
			});

			queryClient.invalidateQueries({ queryKey: ['userDetails', therapistId] });
			onClose();
		},
		onError: (error: CustomError) => {
			capture(PostHogEvent.NotificationSettingsFailed, {
				error_code: error.message ?? 'unknown',
			});

			showAlert({
				message: error.message ?? t('notifications.settings.save-error'),
				severity: 'error',
			});
		},
	});

	const onSubmit = handleSubmit((data) => {
		savePreferencesMutation.mutate(data);
	});

	return {
		isLoading: isUserDetailsLoading,
		isSaving: savePreferencesMutation.isPending,
		methods,
		onSubmit,
		reminderEnabled,
		setValue,
		watch,
	};
};
