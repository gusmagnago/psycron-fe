import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useFeatureFlagEnabled } from '@posthog/react';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { getGoogleCalendarConnectUrl } from '@psycron/api/auth';
import { updateAvailabilitySettings } from '@psycron/api/availability';
import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';
import { editUserById } from '@psycron/api/user';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import type { IClinicAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import {
	JUPITER_AVAILABILITY_CONFIG_KEY,
	useJupiterAvailabilityConfig,
} from '@psycron/hooks/useJupiterAvailabilityConfig';
import { PUBLISHED_KEY } from '@psycron/pages/availability/jupiter-conversation/useJupiterFlow';
import { AVAILABILITYGENERATE, AVAILABILITYSETTINGS } from '@psycron/pages/urls';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
	AddressFormValues,
	ChecklistConfig,
	ChecklistItem,
	DrawerKey,
	UseAvailabilitySettingsReturn,
} from './AvailabilitySettings.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseTimeRangeToInputs = (timeRange: string): { end: string; start: string } => {
	const parts = timeRange.split(/\s*[-–—]\s*/);
	if (parts.length < 2) return { end: '', start: '' };

	const to24h = (raw: string): string => {
		const upper = raw.trim().toUpperCase();
		const isPM = upper.includes('PM');
		const isAM = upper.includes('AM');
		if (!isPM && !isAM) return raw.trim();
		const cleaned = upper.replace(/\s*(AM|PM)/, '').trim();
		const [hStr, mStr] = cleaned.split(':');
		let h = parseInt(hStr, 10);
		const m = parseInt(mStr ?? '0', 10);
		if (isPM && h !== 12) h += 12;
		if (isAM && h === 12) h = 0;
		return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
	};

	return { end: to24h(parts[1]), start: to24h(parts[0]) };
};

const parseDurationKey = (sessionDuration: string): string => {
	const match = sessionDuration.match(/\d+/);
	return match ? match[0] : '45';
};

// ─── Specialty ────────────────────────────────────────────────────────────────

const SPECIALTY_UMBRELLA_KEYS = new Set([
	'PSYCHOLOGY',
	'PSYCHIATRY',
	'PHYSIOTHERAPY',
	'NUTRITION',
	'COACHING',
	'OCCUPATIONAL_THERAPY',
	'SPEECH_THERAPY',
	'SOCIAL_WORK',
	'OTHER',
]);

// ─── Static config ────────────────────────────────────────────────────────────

const CHECKLIST_CONFIG: ChecklistConfig[] = [
	{
		configuredBy: (a) => a.workingDays.length > 0 && !!a.timeRange,
		descKey: 'jupiter.post-publish.checklist-working-hours-desc',
		id: 'working-hours',
		isRecommended: false,
		onConfigureDrawer: 'working-hours',
		titleKey: 'jupiter.post-publish.checklist-working-hours',
	},
	{
		configuredBy: (a) => !!a.sessionType,
		descKey: 'jupiter.post-publish.checklist-session-type-desc',
		id: 'session-type',
		isRecommended: false,
		onConfigureDrawer: 'session-type',
		titleKey: 'jupiter.post-publish.checklist-session-type',
	},
	{
		configuredBy: (a) => !!a.sessionDuration,
		descKey: 'jupiter.post-publish.checklist-duration-desc',
		id: 'session-duration',
		isRecommended: false,
		onConfigureDrawer: 'session-duration',
		titleKey: 'jupiter.post-publish.checklist-duration',
	},
	{
		configuredBy: (a) => !!a.timezone,
		descKey: 'jupiter.post-publish.checklist-timezone-desc',
		id: 'timezone',
		isRecommended: false,
		onConfigureDrawer: 'timezone',
		titleKey: 'jupiter.post-publish.checklist-timezone',
	},
	{
		configuredBy: (a) => a.bufferTimeMinutes != null && a.bufferTimeMinutes > 0,
		descKey: 'jupiter.post-publish.checklist-buffer-desc',
		id: 'buffer-time',
		isRecommended: true,
		onConfigureDrawer: 'buffer-time',
		titleKey: 'jupiter.post-publish.checklist-buffer',
	},
	{
		configuredBy: () => false,
		descKey: 'jupiter.post-publish.checklist-cancel-desc',
		disabled: true,
		id: 'cancellation-policy',
		isRecommended: false,
		titleKey: 'jupiter.post-publish.checklist-cancel-policy',
	},
	{
		configuredBy: (a) => !!a.googleCalendarConnected,
		descKey: 'jupiter.post-publish.checklist-calendar-desc',
		id: 'google-calendar',
		isRecommended: true,
		onConfigureDrawer: 'google-calendar',
		titleKey: 'jupiter.post-publish.checklist-calendar-sync',
	},
	{
		configuredBy: (a) => !!a.recurrencePattern,
		descKey: 'jupiter.post-publish.checklist-recurrence-desc',
		id: 'recurrence-pattern',
		isRecommended: false,
		onConfigureDrawer: 'recurrence-pattern',
		titleKey: 'jupiter.post-publish.checklist-recurrence',
	},
	{
		configuredBy: (a) => !!a.specialty,
		descKey: 'jupiter.post-publish.checklist-specialty-desc',
		id: 'specialty',
		isRecommended: false,
		onConfigureDrawer: 'specialty',
		titleKey: 'jupiter.post-publish.checklist-specialty',
	},
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAvailabilitySettings = (): UseAvailabilitySettingsReturn => {
	const { t, i18n } = useTranslation();
	const { locale } = useParams<{ locale: string }>();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [activeDrawer, setActiveDrawer] = useState<DrawerKey>(null);
	const [bannerDismissed, setBannerDismissed] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [showTimezoneWarning, setShowTimezoneWarning] = useState(false);

	// Buffer time
	const [bufferInput, setBufferInput] = useState('');

	// Working hours
	const [workingDaysInput, setWorkingDaysInput] = useState<string[]>([]);
	const [startTimeInput, setStartTimeInput] = useState('');
	const [endTimeInput, setEndTimeInput] = useState('');

	// Session type
	const [sessionTypeInput, setSessionTypeInput] = useState('');

	// Session duration
	const [sessionDurationInput, setSessionDurationInput] = useState('');

	// Recurrence pattern
	const [recurrencePatternInput, setRecurrencePatternInput] = useState('');

	// Timezone
	const [timezoneInput, setTimezoneInput] = useState('');

	// Specialty
	const [specialtyInput, setSpecialtyInput] = useState('');
	const [specialtyDetailInput, setSpecialtyDetailInput] = useState('');

	const { availability, isLoading } = useJupiterAvailabilityConfig();
	const { availabilityData } = useAvailability();
	const { userDetails, therapistId } = useUserDetails();

	const emptyAddress: IClinicAddress = { city: '', country: '', postcode: '', street: '' };
	const addressFormMethods = useForm<AddressFormValues>({
		defaultValues: { clinicAddress: emptyAddress },
	});

	const isCancellationPolicyEnabled = useFeatureFlagEnabled('availability_cancellation_policy');
	const isBufferTimeEnabled = useFeatureFlagEnabled('availability_buffer_time');
	const isJupiterCtaEnabled = useFeatureFlagEnabled('jupiter_cta_availability');

	const openDrawer = useCallback(
		(key: DrawerKey) => {
			if (availability) {
				if (key === 'working-hours') {
					setWorkingDaysInput([...availability.workingDays]);
					const { end, start } = parseTimeRangeToInputs(availability.timeRange);
					setStartTimeInput(start);
					setEndTimeInput(end);
				} else if (key === 'session-type') {
					setSessionTypeInput(availability.sessionType);
				} else if (key === 'session-duration') {
					setSessionDurationInput(parseDurationKey(availability.sessionDuration));
				} else if (key === 'timezone') {
					setTimezoneInput(availability.timezone);
				} else if (key === 'recurrence-pattern') {
					setRecurrencePatternInput(availability.recurrencePattern ?? '');
				} else if (key === 'session-address') {
					addressFormMethods.reset({
						clinicAddress: userDetails?.clinicAddress ?? emptyAddress,
					});
				} else if (key === 'specialty') {
					const existing = availability.specialty ?? '';
					const isUmbrella = SPECIALTY_UMBRELLA_KEYS.has(existing);
					setSpecialtyInput(isUmbrella ? existing : '');
					setSpecialtyDetailInput(isUmbrella ? '' : existing);
				}
			}
			setActiveDrawer(key);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[availability, addressFormMethods, userDetails?.clinicAddress]
	);

	const closeDrawer = useCallback(() => {
		setActiveDrawer(null);
		setBufferInput('');
		setWorkingDaysInput([]);
		setStartTimeInput('');
		setEndTimeInput('');
		setRecurrencePatternInput('');
		setSessionTypeInput('');
		setSessionDurationInput('');
		setTimezoneInput('');
		setSpecialtyInput('');
		setSpecialtyDetailInput('');
	}, []);

	const checklistItems = useMemo<ChecklistItem[]>(() => {
		if (!availability) return [];

		const items = CHECKLIST_CONFIG.map((config): ChecklistItem => {
			const isFlagDisabled =
				(config.id === 'cancellation-policy' && !isCancellationPolicyEnabled) ||
				(config.id === 'buffer-time' && !isBufferTimeEnabled);

			const isDisabled = isFlagDisabled || (config.disabled ?? false);

			return {
				descKey: config.descKey,
				id: config.id,
				isConfigured: isDisabled ? false : config.configuredBy(availability),
				isDisabled,
				isRecommended: config.isRecommended,
				onConfigure:
					config.onConfigureDrawer != null
						? () => openDrawer(config.onConfigureDrawer as DrawerKey)
						: undefined,
				titleKey: config.titleKey,
			};
		});

		if (availability.sessionType === 'IN_PERSON' || availability.sessionType === 'BOTH') {
			const clinicAddress = userDetails?.clinicAddress;
			items.push({
				descKey: 'availability.settings.session-address-desc',
				id: 'session-address',
				isConfigured: !!clinicAddress?.street && !!clinicAddress?.city,
				isDisabled: false,
				isRecommended: true,
				onConfigure: () => openDrawer('session-address'),
				titleKey: 'availability.settings.session-address-title',
			});
		}

		return items.sort((a, b) => {
			const rank = (item: ChecklistItem) => {
				if (item.isConfigured) return 0;
				if (!item.isDisabled) return 1;
				return 2;
			};

			return rank(a) - rank(b);
		});
	}, [availability, isBufferTimeEnabled, isCancellationPolicyEnabled, openDrawer, userDetails?.clinicAddress]);

	const activeCount = useMemo(
		() => checklistItems.filter((item) => !item.isDisabled).length,
		[checklistItems]
	);

	const configuredCount = useMemo(
		() => checklistItems.filter((item) => item.isConfigured).length,
		[checklistItems]
	);

	const progress = activeCount > 0 ? Math.round((configuredCount / activeCount) * 100) : 0;

	const statusStats = useMemo(() => {
		const todayStr = new Date().toISOString().slice(0, 10);

		const upcomingDates = (availabilityData?.dates ?? []).filter(
			(d) => d.date >= todayStr && d.slots?.length
		);
		const upcomingBookings = upcomingDates.reduce(
			(sum, d) => sum + (d.slots?.filter((s) => s.status === 'BOOKED').length ?? 0),
			0
		);
		const totalUpcomingSlots = upcomingDates.reduce(
			(sum, d) => sum + (d.slots?.length ?? 0),
			0
		);
		const percentBooked = totalUpcomingSlots > 0
			? Math.round((upcomingBookings / totalUpcomingSlots) * 100)
			: 0;

		let activeHoursPerWeek = 0;
		if (availability?.timeRange && availability.workingDays?.length) {
			const parts = availability.timeRange.split(/\s*[-–—]\s*/);
			if (parts.length === 2) {
				const [sh, sm] = parts[0].split(':').map(Number);
				const [eh, em] = parts[1].split(':').map(Number);
				const hoursPerDay = (eh * 60 + em - (sh * 60 + sm)) / 60;
				activeHoursPerWeek = Math.round(hoursPerDay * availability.workingDays.length);
			}
		}

		return { activeHoursPerWeek, percentBooked, upcomingBookings };
	}, [availability?.timeRange, availability?.workingDays, availabilityData?.dates]);

	const firstMissingRecommended = useMemo(
		() => checklistItems.find((item) => item.isRecommended && !item.isConfigured && !item.isDisabled),
		[checklistItems]
	);

	const settingsMutation = useMutation({
		mutationFn: updateAvailabilitySettings,
		onError: () => {
			showAlert({ message: t('availability.settings.save-error'), severity: 'error' });
		},
		onSuccess: (updated, variables) => {
			queryClient.setQueryData<IAvailabilityRecord>(
				[JUPITER_AVAILABILITY_CONFIG_KEY],
				(prev) => (prev ? { ...prev, ...updated } : prev)
			);
			queryClient.refetchQueries({ queryKey: ['therapistAvailability'] });
			queryClient.refetchQueries({ queryKey: ['jupiterAvailability'] });

			const setting = variables.workingDays || variables.timeRange
				? 'working_hours'
				: variables.sessionType
					? 'session_type'
					: variables.sessionDuration
						? 'session_duration'
						: variables.timezone
							? 'timezone'
							: variables.bufferTimeMinutes !== undefined
								? 'buffer_time'
								: variables.specialty
									? 'specialty'
									: 'recurrence_pattern';

			const newValue = variables.workingDays
				? variables.workingDays.join(',')
				: variables.timeRange
					?? variables.sessionType
					?? variables.sessionDuration
					?? variables.timezone
					?? String(variables.bufferTimeMinutes ?? '')
					?? variables.specialty
					?? variables.recurrencePattern
					?? '';

			capture(PostHogEvent.AvailabilitySettingSaved, { new_value: newValue, setting });

			showAlert({ message: t('availability.settings.save-success'), severity: 'success' });
			closeDrawer();
		},
	});

	const handleBufferSave = useCallback(() => {
		const minutes = parseInt(bufferInput, 10);
		if (isNaN(minutes) || minutes < 0 || minutes > 120) return;
		settingsMutation.mutate({ bufferTimeMinutes: minutes });
	}, [bufferInput, settingsMutation]);

	const handleWorkingHoursSave = useCallback(() => {
		if (workingDaysInput.length === 0 || !startTimeInput || !endTimeInput) return;
		settingsMutation.mutate({
			timeRange: `${startTimeInput} - ${endTimeInput}`,
			workingDays: workingDaysInput,
		});
	}, [endTimeInput, settingsMutation, startTimeInput, workingDaysInput]);

	const handleSessionTypeSave = useCallback(() => {
		if (!sessionTypeInput) return;
		settingsMutation.mutate({ sessionType: sessionTypeInput });
	}, [sessionTypeInput, settingsMutation]);

	const handleSessionDurationSave = useCallback(() => {
		if (!sessionDurationInput) return;
		settingsMutation.mutate({ sessionDuration: `${sessionDurationInput} minutes` });
	}, [sessionDurationInput, settingsMutation]);

	const handleTimezoneSave = useCallback(() => {
		if (!timezoneInput) return;
		if (availability?.timezone && timezoneInput !== availability.timezone) {
			setShowTimezoneWarning(true);
			return;
		}
		settingsMutation.mutate({ timezone: timezoneInput });
	}, [availability?.timezone, settingsMutation, timezoneInput]);

	const confirmTimezoneSave = useCallback(() => {
		setShowTimezoneWarning(false);
		settingsMutation.mutate({ timezone: timezoneInput });
	}, [settingsMutation, timezoneInput]);

	const cancelTimezoneWarning = useCallback(() => {
		setShowTimezoneWarning(false);
	}, []);

	const handleRecurrencePatternSave = useCallback(() => {
		if (!recurrencePatternInput) return;
		settingsMutation.mutate({ recurrencePattern: recurrencePatternInput as 'WEEKLY' | 'MONTHLY' });
	}, [recurrencePatternInput, settingsMutation]);

	const handleSpecialtySave = useCallback(() => {
		if (!specialtyInput) return;
		if (specialtyDetailInput.trim()) {
			capture(PostHogEvent.AvailabilitySettingSaved, {
				new_value: specialtyDetailInput.trim(),
				setting: 'specialty_detail',
			});
		}
		settingsMutation.mutate({ specialty: specialtyInput });
	}, [specialtyDetailInput, specialtyInput, settingsMutation]);

	const addressMutation = useMutation({
		mutationFn: (data: AddressFormValues) =>
			editUserById({ data: { clinicAddress: data.clinicAddress }, userId: therapistId }),
		onError: () => {
			showAlert({ message: t('availability.settings.save-error'), severity: 'error' });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userDetails', therapistId] });
			capture(PostHogEvent.AvailabilitySettingSaved, {
				new_value: '',
				setting: 'session_address',
			});
			showAlert({ message: t('availability.settings.save-success'), severity: 'success' });
			closeDrawer();
		},
	});

	const handleAddressSave = useCallback(() => {
		addressFormMethods.handleSubmit((data) => addressMutation.mutate(data))();
	}, [addressFormMethods, addressMutation]);

	const toggleWorkingDay = useCallback((day: string) => {
		setWorkingDaysInput((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
		);
	}, []);

	useEffect(() => {
		if (searchParams.get('calendar') !== 'connected') return;

		queryClient.invalidateQueries({ queryKey: [JUPITER_AVAILABILITY_CONFIG_KEY] });
		showAlert({ message: t('availability.settings.google-calendar-connected'), severity: 'success' });

		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.delete('calendar');
			return next;
		}, { replace: true });
	}, [queryClient, searchParams, setSearchParams, showAlert, t]);

	useEffect(() => {
		if (!localStorage.getItem(PUBLISHED_KEY)) return;
		localStorage.removeItem(PUBLISHED_KEY);
		showAlert({ message: t('availability.settings.first-publish-alert'), severity: 'success' });
	}, [showAlert, t]);

	const handleGoogleCalendarConnect = useCallback(async () => {
		setIsConnecting(true);
		try {
			const { url } = await getGoogleCalendarConnectUrl({
				locale: i18n.language,
				returnTo: `/${AVAILABILITYSETTINGS}?calendar=connected`,
			});
			window.location.assign(url);
		} catch {
			showAlert({ message: t('availability.settings.google-calendar-connect-error'), severity: 'error' });
			setIsConnecting(false);
		}
	}, [i18n.language, showAlert, t]);

	const handleJupiterCta = useCallback(() => {
		navigate(`/${locale}/${AVAILABILITYGENERATE}`);
	}, [locale, navigate]);

	const renderActionLabel = useCallback(
		(item: ChecklistItem): string => {
			if (item.isDisabled) return t('jupiter.post-publish.checklist-action-soon');
			if (item.isConfigured) return t('jupiter.post-publish.checklist-action-edit');
			return t('jupiter.post-publish.checklist-action-configure');
		},
		[t]
	);

	return {
		activeCount,
		activeDrawer,
		addressFormMethods,
		availability,
		bannerDismissed,
		cancelTimezoneWarning,
		confirmTimezoneSave,
		isJupiterCtaEnabled: !!isJupiterCtaEnabled,
		bufferInput,
		checklistItems,
		closeDrawer,
		configuredCount,
		endTimeInput,
		firstMissingRecommended,
		handleAddressSave,
		handleBufferSave,
		handleGoogleCalendarConnect,
		handleJupiterCta,
		handleRecurrencePatternSave,
		handleSessionDurationSave,
		handleSessionTypeSave,
		handleSpecialtySave,
		handleTimezoneSave,
		handleWorkingHoursSave,
		isAddressSaving: addressMutation.isPending,
		isConnecting,
		isLoading,
		isSaving: settingsMutation.isPending,
		showTimezoneWarning,
		openDrawer,
		progress,
		recurrencePatternInput,
		renderActionLabel,
		statusStats,
		sessionDurationInput,
		sessionTypeInput,
		specialtyDetailInput,
		setBannerDismissed,
		setBufferInput,
		setEndTimeInput,
		setRecurrencePatternInput,
		setSessionDurationInput,
		setSessionTypeInput,
		setSpecialtyDetailInput,
		setSpecialtyInput,
		setStartTimeInput,
		setTimezoneInput,
		specialtyInput,
		startTimeInput,
		timezoneInput,
		toggleWorkingDay,
		workingDaysInput,
	};
};
