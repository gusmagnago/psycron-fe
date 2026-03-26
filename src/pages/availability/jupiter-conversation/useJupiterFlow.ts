import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getGoogleCalendarConnectUrl, getGoogleCalendarStatus } from '@psycron/api/auth';
import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';
import {
	generateJupiterAvailability,
	importGoogleCalendarSchedule,
	type RecurrencePattern,
} from '@psycron/api/jupiter';
import { editUserById } from '@psycron/api/user';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { AVAILABILITYGENERATE, AVAILABILITYPATH } from '@psycron/pages/urls';
import { useQueryClient } from '@tanstack/react-query';

import type {
	JupiterAnswers,
	JupiterMessage,
	JupiterStep,
} from './JupiterConversation.types';
import {
	SPECIALTY_CHIP_KEY_MAP,
	SPECIALTY_SESSION_TYPE_DEFAULTS,
	SPECIALTY_SESSION_TYPE_FALLBACK,
} from './jupiterSpecialtyDefaults';

export const STORAGE_KEY = '_psy_jd';
export const ONBOARDING_KEY = '_psy_ob';

const SESSION_TYPE_CANONICAL: Record<string, string> = {
	'chip-both': 'BOTH',
	'chip-in-person': 'IN_PERSON',
	'chip-online': 'ONLINE',
};

// One-time migration from legacy readable keys
const LEGACY_STORAGE_KEY = 'jupiter-flow';
const LEGACY_ONBOARDING_KEY = 'psycron-jupiter-onboarded';
const migrateLocalStorageKeys = () => {
	const draft = localStorage.getItem(LEGACY_STORAGE_KEY);
	if (draft) {
		localStorage.setItem(STORAGE_KEY, draft);
		localStorage.removeItem(LEGACY_STORAGE_KEY);
	}
	const onboarded = localStorage.getItem(LEGACY_ONBOARDING_KEY);
	if (onboarded) {
		localStorage.setItem(ONBOARDING_KEY, onboarded);
		localStorage.removeItem(LEGACY_ONBOARDING_KEY);
	}
};

migrateLocalStorageKeys();

const VALID_SESSION_TYPE_KEYS = new Set(['chip-online', 'chip-in-person', 'chip-both']);

const loadSaved = (): {
	answers: JupiterAnswers;
	step: JupiterStep;
} | null => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw) as { answers: JupiterAnswers; step: JupiterStep };
		// Migrate: if sessionType is a translated label (pre-chip-key era), clear it
		if (data.answers?.sessionType && !VALID_SESSION_TYPE_KEYS.has(data.answers.sessionType)) {
			data.answers = { ...data.answers, sessionType: undefined };
			if (data.step === 'preview') data.step = 'session-type';
		}
		// Migrate: if at preview but recurrencePattern not yet collected, redirect to that step
		if (data.step === 'preview' && !data.answers?.recurrencePattern) {
			data.step = 'recurrence-pattern';
		}
		return data;
	} catch {
		return null;
	}
};

const STEP_QUESTION_KEY: Partial<Record<JupiterStep, string>> = {
	'calendar-choice': 'jupiter.calendar-choice.msg2',
	'recurrence-pattern': 'jupiter.recurrence-pattern.response',
	'session-duration': 'jupiter.session-duration.response',
	'session-type': 'jupiter.session-type.response',
	specialty: 'jupiter.specialty.response',
	'time-range': 'jupiter.time-range.response',
	timezone: 'jupiter.timezone.response',
	'working-days': 'jupiter.working-days.response',
};

const WEEKDAY_KEY_MAP: Record<string, string> = {
	'chip-fri': 'FRIDAY',
	'chip-mon': 'MONDAY',
	'chip-sat': 'SATURDAY',
	'chip-sun': 'SUNDAY',
	'chip-thu': 'THURSDAY',
	'chip-tue': 'TUESDAY',
	'chip-wed': 'WEDNESDAY',
};

const CANONICAL_TO_CHIP: Record<string, string> = {
	FRIDAY: 'chip-fri',
	MONDAY: 'chip-mon',
	SATURDAY: 'chip-sat',
	SUNDAY: 'chip-sun',
	THURSDAY: 'chip-thu',
	TUESDAY: 'chip-tue',
	WEDNESDAY: 'chip-wed',
};

interface UseJupiterFlowOptions {
	initialAnswers?: JupiterAnswers;
	therapistId?: string;
	userSpecialities?: string[];
}

export const useJupiterFlow = ({
	initialAnswers,
	therapistId,
	userSpecialities,
}: UseJupiterFlowOptions = {}) => {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const saved = useMemo(() => loadSaved(), []);

	const isCalendarConnected = useMemo(() => {
		const params = new URLSearchParams(window.location.search);
		return params.get('calendar') === 'connected';
	}, []);

	const [step, setStep] = useState<JupiterStep>(() => {
		if (isCalendarConnected) return 'google-success';
		if (saved) return saved.step;
		if (!userSpecialities?.length) return 'specialty';
		return 'calendar-choice';
	});
	const [answers, setAnswers] = useState<JupiterAnswers>(
		initialAnswers ?? saved?.answers ?? {}
	);
	const [messages, setMessages] = useState<JupiterMessage[]>([]);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [specialityKey, setSpecialityKey] = useState(0);
	const [workingDaysKey, setWorkingDaysKey] = useState(0);

	const hasInitialized = useRef(false);

	const detectedTimezone = useMemo(
		() => Intl.DateTimeFormat().resolvedOptions().timeZone,
		[]
	);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }));
	}, [step, answers]);

	const addBotMessage = useCallback((content: string, showIcon = true) => {
		setMessages((prev) => [...prev, { content, sender: 'bot', showIcon }]);
	}, []);

	const addUserMessage = useCallback((content: string) => {
		setMessages((prev) => [...prev, { content, sender: 'user' }]);
	}, []);

	// ─── Core transition helpers ───────────────────────────────────────────────

	const advance = useCallback(
		(botKey: string, nextStep: JupiterStep, delay = 300) => {
			setTimeout(() => {
				addBotMessage(t(botKey));
				setStep(nextStep);
			}, delay);
		},
		[addBotMessage, t]
	);

	const commit = useCallback(
		<K extends keyof JupiterAnswers>(
			userMessage: string,
			field: K,
			value: JupiterAnswers[K],
			botKey: string,
			nextStep: JupiterStep
		) => {
			addUserMessage(userMessage);
			setAnswers((prev) => ({ ...prev, [field]: value }));
			advance(botKey, nextStep);
		},
		[addUserMessage, advance]
	);

	// ─── Google OAuth return handler ───────────────────────────────────────────

	useEffect(() => {
		if (!isCalendarConnected) return;

		const url = new URL(window.location.href);
		url.searchParams.delete('calendar');
		window.history.replaceState({}, '', url.toString());

		hasInitialized.current = true;
	}, [isCalendarConnected]);

	// ─── Flow initialization ───────────────────────────────────────────────────

	const initFlow = useCallback(() => {
		if (hasInitialized.current) return;
		hasInitialized.current = true;

		if (saved) {
			addBotMessage(t('jupiter.errors.session-timeout'));
			const questionKey = STEP_QUESTION_KEY[saved.step];
			if (questionKey) {
				setTimeout(() => addBotMessage(t(questionKey), false), 500);
			}
			return;
		}

		addBotMessage(t('jupiter.calendar-choice.msg1'));
		setTimeout(
			() =>
				addBotMessage(
					t(
						!userSpecialities?.length
							? 'jupiter.specialty.response'
							: 'jupiter.calendar-choice.msg2'
					),
					false
				),
			500
		);
	}, [addBotMessage, saved, t, userSpecialities?.length]);

	// ─── Step handlers ─────────────────────────────────────────────────────────

	const handleCalendarChoice = useCallback(
		async (key: string) => {
			if (key === 'google') {
				addUserMessage(t('jupiter.calendar-choice.chip-google'));
				setAnswers((prev) => ({ ...prev, calendarChoice: 'google' }));

				try {
					const status = await getGoogleCalendarStatus();
					if (status.connected) {
						// Already connected — skip OAuth, go straight to google-success
						addBotMessage(t('jupiter.calendar-choice.google-already-connected'));
						setTimeout(() => setStep('google-success'), 300);
						return;
					}
				} catch {
					// Status check failed — fall through to normal OAuth flow
				}

				setStep('google-permissions');
			} else {
				addUserMessage(t('jupiter.calendar-choice.chip-manual'));
				setAnswers((prev) => ({ ...prev, calendarChoice: 'manual' }));
				advance('jupiter.working-days.response', 'working-days', 500);
			}
		},
		[addBotMessage, addUserMessage, advance, t]
	);

	const handleWorkingDays = useCallback(
		(selectedKeys: string[]) => {
			const dayLabels = selectedKeys
				.map((key) => t(`jupiter.working-days.${key}`))
				.join(', ');
			const canonicalDays = selectedKeys.map(
				(key) => WEEKDAY_KEY_MAP[key] ?? key
			);
			addUserMessage(dayLabels);
			setAnswers((prev) => ({ ...prev, workingDays: canonicalDays }));
			advance('jupiter.time-range.response', 'time-range');
		},
		[addUserMessage, advance, t]
	);

	// Accepts canonical day names (e.g. ["MONDAY","FRIDAY"]) from AI-parsed text
	const handleWorkingDaysFromText = useCallback(
		(canonicalDays: string[]) => {
			const chipKeys = canonicalDays
				.map((d) => CANONICAL_TO_CHIP[d])
				.filter(Boolean) as string[];
			if (chipKeys.length > 0) {
				handleWorkingDays(chipKeys);
			}
		},
		[handleWorkingDays]
	);

	const retryWorkingDays = useCallback(() => {
		addBotMessage(t('jupiter.errors.invalid-input'));
		setWorkingDaysKey((k) => k + 1);
	}, [addBotMessage, t]);

	// ─── Specialty handlers ────────────────────────────────────────────────────

	const commitSpecialities = useCallback(
		async (canonicals: string[]) => {
			const label = canonicals.join(', ');
			addUserMessage(label);
			setAnswers((prev) => ({ ...prev, specialities: canonicals }));

			if (therapistId) {
				try {
					await editUserById({ data: { specialities: canonicals }, userId: therapistId });
				} catch {
					// Non-critical — flow continues regardless
				}
			}

			const defaultSessionType =
				SPECIALTY_SESSION_TYPE_DEFAULTS[canonicals[0]] ??
				SPECIALTY_SESSION_TYPE_FALLBACK;
			setAnswers((prev) => ({ ...prev, sessionType: defaultSessionType }));

			addBotMessage(t('jupiter.specialty.acknowledged'));
			setTimeout(() => {
				addBotMessage(t('jupiter.calendar-choice.msg2'), false);
				setStep('calendar-choice');
			}, 500);
		},
		[addBotMessage, addUserMessage, therapistId, t]
	);

	const handleSpecialty = useCallback(
		(selectedKeys: string[]) => {
			const canonicals = selectedKeys.map(
				(k) => SPECIALTY_CHIP_KEY_MAP[k] ?? k.replace('chip-', '')
			);
			commitSpecialities(canonicals);
		},
		[commitSpecialities]
	);

	const handleSpecialtyFromText = useCallback(
		(canonicals: string[]) => {
			commitSpecialities(canonicals);
		},
		[commitSpecialities]
	);

	const retrySpeciality = useCallback(
		(isRejected = false) => {
			addBotMessage(
				t(
					isRejected
						? 'jupiter.specialty.error-rejected'
						: 'jupiter.specialty.error-rephrase'
				)
			);
			setSpecialityKey((k) => k + 1);
		},
		[addBotMessage, t]
	);

	// Receives the resolved display label (from chip option or free text input)
	const handleTimeRange = useCallback(
		(label: string) =>
			commit(
				label,
				'timeRange',
				label,
				'jupiter.session-duration.response',
				'session-duration'
			),
		[commit]
	);

	// Receives the resolved display label (from chip option or free text input)
	const handleSessionDuration = useCallback(
		(label: string) => {
			const hasSpecialityDefault =
				answers.specialities?.length &&
				SPECIALTY_SESSION_TYPE_DEFAULTS[answers.specialities[0]];
			const sessionTypeResponseKey = hasSpecialityDefault
				? 'jupiter.session-type.response-with-suggestion'
				: 'jupiter.session-type.response';
			commit(label, 'sessionDuration', label, sessionTypeResponseKey, 'session-type');
		},
		[answers.specialities, commit]
	);

	const handleSessionType = useCallback(
		(key: string) => {
			const label = t(`jupiter.session-type.${key}`);
			commit(
				label,
				'sessionType',
				SESSION_TYPE_CANONICAL[key] ?? key,
				'jupiter.timezone.response',
				'timezone'
			);
		},
		[commit, t]
	);

	const handleTimezone = useCallback(
		(key: string) => {
			if (key === 'chip-yes') {
				addUserMessage(t('jupiter.timezone.chip-yes'));
				setAnswers((prev) => ({
					...prev,
					timezone: detectedTimezone,
					timezoneConfirmed: true,
				}));
				advance('jupiter.recurrence-pattern.response', 'recurrence-pattern', 300);
			} else {
				addUserMessage(t('jupiter.timezone.chip-no'));
				addBotMessage(t('jupiter.timezone.follow-up'));
				setAnswers((prev) => ({ ...prev, timezoneConfirmed: false }));
			}
		},
		[addBotMessage, addUserMessage, advance, detectedTimezone, t]
	);

	const handleTimezoneSelect = useCallback(
		(tz: string) => {
			addUserMessage(tz);
			setAnswers((prev) => ({ ...prev, timezone: tz }));
			advance('jupiter.recurrence-pattern.response', 'recurrence-pattern', 300);
		},
		[addUserMessage, advance]
	);

	const handleRecurrencePattern = useCallback(
		(key: string) => {
			const value: RecurrencePattern = key === 'chip-weekly' ? 'WEEKLY' : 'MONTHLY';
			const label = t(`jupiter.recurrence-pattern.${key}`);
			const summaryKey =
				key === 'chip-weekly'
					? 'jupiter.recurrence-pattern.summary-weekly'
					: 'jupiter.recurrence-pattern.summary-monthly';
			commit(label, 'recurrencePattern', value, summaryKey, 'preview');
		},
		[commit, t]
	);

	// ─── Publish / Reset ───────────────────────────────────────────────────────

	const handlePublish = useCallback(async () => {
		if (
			!answers.workingDays?.length ||
			!answers.timeRange ||
			!answers.sessionDuration ||
			!answers.sessionType ||
			!answers.timezone ||
			!answers.recurrencePattern
		)
			return;

		setIsPublishing(true);
		try {
			const { availabilityId } = await generateJupiterAvailability({
				recurrencePattern: answers.recurrencePattern,
				workingDays: answers.workingDays,
				timeRange: answers.timeRange,
				sessionDuration: answers.sessionDuration,
				sessionType: answers.sessionType,
				timezone: answers.timezone,
			});
			localStorage.removeItem(STORAGE_KEY);
			localStorage.setItem(ONBOARDING_KEY, 'true');
			const record: IAvailabilityRecord = {
				availabilityId,
				recurrencePattern: answers.recurrencePattern,
				sessionDuration: answers.sessionDuration!,
				sessionType: answers.sessionType!,
				timeRange: answers.timeRange!,
				timezone: answers.timezone!,
				workingDays: answers.workingDays!,
			};
			queryClient.setQueryData<IAvailabilityRecord>(['availability'], record);
			queryClient.setQueryData<IAvailabilityRecord>(['availabilityGate'], record);
			showAlert({ message: t('jupiter.post-publish.success-toast'), severity: 'success' });
			showAlert({ message: t('jupiter.post-publish.welcome-toast'), severity: 'success' });
			navigate(`/${i18n.language}/${AVAILABILITYPATH}`);
		} catch {
			addBotMessage(t('jupiter.errors.save-fail'));
		} finally {
			setIsPublishing(false);
		}
	}, [answers, addBotMessage, i18n.language, navigate, queryClient, showAlert, t]);

	const handleReset = useCallback(() => {
		localStorage.removeItem(STORAGE_KEY);
		setStep('calendar-choice');
		setAnswers({});
		setMessages([
			{
				content: t('jupiter.calendar-choice.msg2'),
				sender: 'bot',
				showIcon: true,
			},
		]);
		hasInitialized.current = true;
	}, [t]);

	// ─── Google Calendar path ──────────────────────────────────────────────────

	const handleGoogleContinue = useCallback(async () => {
		try {
			const { url } = await getGoogleCalendarConnectUrl({
				locale: i18n.language,
				returnTo: `/${AVAILABILITYGENERATE}?calendar=connected`,
			});
			window.location.assign(url);
		} catch {
			addBotMessage(t('jupiter.errors.google-oauth-fail'));
		}
	}, [addBotMessage, i18n.language, t]);

	const handleGoogleBack = useCallback(() => setStep('calendar-choice'), []);

	const handleGooglePostConnect = useCallback(
		async (key: string) => {
			addUserMessage(
				key === 'chip-use-existing'
					? t('jupiter.google-calendar.chip-use-existing')
					: t('jupiter.google-calendar.chip-define-hours')
			);

			if (key === 'chip-use-existing') {
				setIsImporting(true);
				addBotMessage(t('jupiter.google-calendar.importing'));

				const schedule = await importGoogleCalendarSchedule();

				setIsImporting(false);

				if (schedule && schedule.workingDays.length > 0) {
					const timeRange = `${schedule.startTime} - ${schedule.endTime}`;
					setAnswers((prev) => ({
						...prev,
						workingDays: schedule.workingDays,
						timeRange,
					}));
					setTimeout(() => {
						addBotMessage(t('jupiter.google-calendar.imported'), false);
						setStep('session-duration');
					}, 300);
				} else {
					setTimeout(() => {
						addBotMessage(t('jupiter.google-calendar.import-failed'), false);
						setStep('working-days');
					}, 300);
				}
			} else {
				advance('jupiter.working-days.response', 'working-days');
			}
		},
		[addBotMessage, addUserMessage, advance, setAnswers, t]
	);

	return {
		step,
		answers,
		messages,
		isImporting,
		isPublishing,
		specialityKey,
		workingDaysKey,
		detectedTimezone,
		initFlow,
		handleCalendarChoice,
		handleGoogleBack,
		handleGoogleContinue,
		handleGooglePostConnect,
		handlePublish,
		handleRecurrencePattern,
		handleReset,
		handleSessionDuration,
		handleSessionType,
		handleSpecialty,
		handleSpecialtyFromText,
		handleTimeRange,
		handleTimezone,
		handleTimezoneSelect,
		handleWorkingDays,
		handleWorkingDaysFromText,
		retrySpeciality,
		retryWorkingDays,
	};
};
