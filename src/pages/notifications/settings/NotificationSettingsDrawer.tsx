import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@psycron/components/checkbox/Checkbox';
import { SettingsDrawer } from '@psycron/components/drawer/SettingsDrawer';
import { Switch } from '@psycron/components/switch/components/item/Switch';

import { useNotificationSettings } from './hooks/useNotificationSettings';
import {
	ChannelCheckboxGroup,
	LeadTimeChip,
	LeadTimeRow,
	SectionBody,
	SectionCard,
	SectionDesc,
	SectionHeader,
	SectionTitle,
	SettingsPageWrapper,
} from './NotificationSettingsPage.styles';
import type {
	ChannelSectionConfig,
	NotificationSettingsDrawerProps,
} from './NotificationSettingsPage.types';
import { REMINDER_LEAD_TIME_OPTIONS } from './NotificationSettingsPage.types';

const CHANNEL_SECTIONS: ChannelSectionConfig[] = [
	{
		descKey: 'notifications.settings.appointment-confirmation.description',
		field: 'appointmentConfirmation',
		titleKey: 'notifications.settings.appointment-confirmation.title',
	},
	{
		descKey: 'notifications.settings.appointment-updated.description',
		field: 'appointmentUpdated',
		titleKey: 'notifications.settings.appointment-updated.title',
	},
];

export const NotificationSettingsDrawer = ({
	isOpen,
	onClose,
}: NotificationSettingsDrawerProps) => {
	const { t } = useTranslation();
	const { isSaving, methods, onSubmit, setValue, watch } =
		useNotificationSettings({ onClose });

	if (!isOpen) return null;

	const reminderEnabled = watch('reminder.enabled');
	const reminderLeadTime = watch('reminder.leadTimeMinutes');

	return (
		<SettingsDrawer
			ariaLabel={t('notifications.settings.title')}
			desc={t('notifications.settings.subtitle')}
			isSaving={isSaving}
			onClose={onClose}
			onSave={onSubmit}
			showCancel
			title={t('notifications.settings.title')}
		>
			<FormProvider {...methods}>
				<SettingsPageWrapper>
					{CHANNEL_SECTIONS.map(({ descKey, field, titleKey }) => (
						<SectionCard key={field}>
							<SectionHeader>
								<SectionTitle>{t(titleKey)}</SectionTitle>
								<SectionDesc>{t(descKey)}</SectionDesc>
							</SectionHeader>
							<SectionBody>
								<ChannelCheckboxGroup>
									<Checkbox
										checked={watch(`${field}.email` as const)}
										label={t('notifications.channels.email')}
										onChange={(_, checked) =>
											setValue(`${field}.email` as const, checked)
										}
									/>
									<Checkbox
										checked={watch(`${field}.whatsapp` as const)}
										label={t('notifications.channels.whatsapp')}
										onChange={(_, checked) =>
											setValue(`${field}.whatsapp` as const, checked)
										}
									/>
								</ChannelCheckboxGroup>
							</SectionBody>
						</SectionCard>
					))}

					<SectionCard>
						<SectionHeader>
							<SectionTitle>
								{t('notifications.settings.reminder.title')}
							</SectionTitle>
							<SectionDesc>
								{t('notifications.settings.reminder.description')}
							</SectionDesc>
						</SectionHeader>
						<SectionBody>
							<Switch
								checked={reminderEnabled}
								label={t('notifications.settings.reminder.toggle')}
								onChange={(_, checked) => setValue('reminder.enabled', checked)}
							/>
							{reminderEnabled && (
								<>
									<SectionDesc>
										{t('notifications.settings.reminder.lead-time.label')}
									</SectionDesc>
									<LeadTimeRow>
										{REMINDER_LEAD_TIME_OPTIONS.map(({ labelKey, value }) => (
											<LeadTimeChip
												aria-pressed={reminderLeadTime === value}
												isSelected={reminderLeadTime === value}
												key={value}
												onClick={() =>
													setValue('reminder.leadTimeMinutes', value)
												}
												role='button'
											>
												{t(labelKey)}
											</LeadTimeChip>
										))}
									</LeadTimeRow>
									<ChannelCheckboxGroup>
										<Checkbox
											checked={watch('reminder.email')}
											label={t('notifications.channels.email')}
											onChange={(_, checked) =>
												setValue('reminder.email', checked)
											}
										/>
										<Checkbox
											checked={watch('reminder.whatsapp')}
											label={t('notifications.channels.whatsapp')}
											onChange={(_, checked) =>
												setValue('reminder.whatsapp', checked)
											}
										/>
									</ChannelCheckboxGroup>
								</>
							)}
						</SectionBody>
					</SectionCard>

					<SectionCard>
						<SectionHeader>
							<SectionTitle>
								{t('notifications.settings.calendar-invite.title')}
							</SectionTitle>
							<SectionDesc>
								{t('notifications.settings.calendar-invite.description')}
							</SectionDesc>
						</SectionHeader>
						<SectionBody>
							<Switch
								checked={watch('calendarInvite.enabled')}
								label={t('notifications.settings.calendar-invite.toggle')}
								onChange={(_, checked) =>
									setValue('calendarInvite.enabled', checked)
								}
							/>
						</SectionBody>
					</SectionCard>
				</SettingsPageWrapper>
			</FormProvider>
		</SettingsDrawer>
	);
};
