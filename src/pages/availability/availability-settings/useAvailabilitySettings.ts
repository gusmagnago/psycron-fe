import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useFeatureFlagEnabled } from '@posthog/react';
import { getGoogleCalendarConnectUrl } from '@psycron/api/auth';
import { updateAvailabilitySettings } from '@psycron/api/availability';
import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import {
	JUPITER_AVAILABILITY_CONFIG_KEY,
	useJupiterAvailabilityConfig,
} from '@psycron/hooks/useJupiterAvailabilityConfig';
import { AVAILABILITYGENERATE, AVAILABILITYSETTINGS } from '@psycron/pages/urls';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
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

	// Timezone
	const [timezoneInput, setTimezoneInput] = useState('');

	const { availability, isLoading } = useJupiterAvailabilityConfig();

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
				}
			}
			setActiveDrawer(key);
		},
		[availability]
	);

	const closeDrawer = useCallback(() => {
		setActiveDrawer(null);
		setBufferInput('');
		setWorkingDaysInput([]);
		setStartTimeInput('');
		setEndTimeInput('');
		setSessionTypeInput('');
		setSessionDurationInput('');
		setTimezoneInput('');
	}, []);

	const checklistItems = useMemo<ChecklistItem[]>(() => {
		if (!availability) return [];

		return CHECKLIST_CONFIG.map((config): ChecklistItem => {
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
		}).sort((a, b) => {
			const rank = (item: ChecklistItem) => {
				if (item.isConfigured) return 0;
				if (!item.isDisabled) return 1;
				return 2;
			};

			return rank(a) - rank(b);
		});
	}, [availability, isBufferTimeEnabled, isCancellationPolicyEnabled, openDrawer]);

	const activeCount = useMemo(
		() => checklistItems.filter((item) => !item.isDisabled).length,
		[checklistItems]
	);

	const configuredCount = useMemo(
		() => checklistItems.filter((item) => item.isConfigured).length,
		[checklistItems]
	);

	const progress = activeCount > 0 ? Math.round((configuredCount / activeCount) * 100) : 0;

	const firstMissingRecommended = useMemo(
		() => checklistItems.find((item) => item.isRecommended && !item.isConfigured && !item.isDisabled),
		[checklistItems]
	);

	const settingsMutation = useMutation({
		mutationFn: updateAvailabilitySettings,
		onError: () => {
			showAlert({ message: t('availability.settings.save-error'), severity: 'error' });
		},
		onSuccess: (updated) => {
			queryClient.setQueryData<IAvailabilityRecord>(
				[JUPITER_AVAILABILITY_CONFIG_KEY],
				(prev) => (prev ? { ...prev, ...updated } : prev)
			);
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
		handleBufferSave,
		handleGoogleCalendarConnect,
		handleJupiterCta,
		handleSessionDurationSave,
		handleSessionTypeSave,
		handleTimezoneSave,
		handleWorkingHoursSave,
		isConnecting,
		isLoading,
		isSaving: settingsMutation.isPending,
		showTimezoneWarning,
		openDrawer,
		progress,
		renderActionLabel,
		sessionDurationInput,
		sessionTypeInput,
		setBannerDismissed,
		setBufferInput,
		setEndTimeInput,
		setSessionDurationInput,
		setSessionTypeInput,
		setStartTimeInput,
		setTimezoneInput,
		startTimeInput,
		timezoneInput,
		toggleWorkingDay,
		workingDaysInput,
	};
};
