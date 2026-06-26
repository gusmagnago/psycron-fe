import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { CalendarItem } from '@psycron/api/auth';
import {
	getGoogleCalendarConnectUrl,
	getGoogleCalendarList,
	getGoogleCalendarStatus,
	selectGoogleCalendar,
	syncGoogleCalendar,
} from '@psycron/api/auth';
import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';
import {
	generateJupiterAvailability,
	importGoogleCalendarSchedule,
	type RecurrencePattern,
} from '@psycron/api/jupiter';
import { QUERY_KEYS } from '@psycron/api/queryKeys';
import { editUserById } from '@psycron/api/user';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { AVAILABILITYGENERATE, AVAILABILITYPATH } from '@psycron/pages/urls';
import { useQueryClient } from '@tanstack/react-query';

import type { StatusNoteType } from './status-note/StatusNote.types';
import type {
	JupiterAnswers,
	JupiterMessage,
	JupiterPublishOutcome,
	JupiterStep,
} from './JupiterConversation.types';
import {
	SPECIALTY_CHIP_KEY_MAP,
	SPECIALTY_SESSION_TYPE_DEFAULTS,
	SPECIALTY_SESSION_TYPE_FALLBACK,
} from './jupiterSpecialtyDefaults';

export const STORAGE_KEY = '_psy_jd';
export const ONBOARDING_KEY = '_psy_ob';
export const PUBLISHED_KEY = '_psy_pub';

// Delay before a Jupiter reply lands, during which the typing dots show.
const TYPING_DELAY = 600;

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

const VALID_SESSION_TYPE_KEYS = new Set([
	'chip-online',
	'chip-in-person',
	'chip-both',
]);

const loadSaved = (): {
	answers: JupiterAnswers;
	step: JupiterStep;
} | null => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw) as {
			answers: JupiterAnswers;
			step: JupiterStep;
		};
		// Migrate: if sessionType is a translated label (pre-chip-key era), clear it
		if (
			data.answers?.sessionType &&
			!VALID_SESSION_TYPE_KEYS.has(data.answers.sessionType)
		) {
			data.answers = { ...data.answers, sessionType: undefined };
			if (data.step === 'preview') data.step = 'session-type';
		}
		// Migrate: if at preview but recurrencePattern not yet collected, redirect
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

// Explanatory note rendered under each Jupiter question (the "why").
const STEP_NOTE_CONFIG: Partial<
	Record<JupiterStep, { key: string; testId: string; type?: StatusNoteType }>
> = {
	'calendar-choice': {
		key: 'jupiter.notes.start-choice',
		testId: 'jupiter-onboarding-start-choice-note',
	},
	'recurrence-pattern': {
		key: 'jupiter.notes.recurrence',
		testId: 'jupiter-onboarding-recurrence-note',
	},
	'session-duration': {
		key: 'jupiter.notes.session-duration',
		testId: 'jupiter-onboarding-session-duration-note',
	},
	'session-type': {
		key: 'jupiter.notes.session-type',
		testId: 'jupiter-onboarding-session-type-note',
	},
	preview: {
		key: 'jupiter.notes.preview',
		testId: 'jupiter-onboarding-preview-note',
		type: 'success',
	},
	specialty: {
		key: 'jupiter.notes.specialty',
		testId: 'jupiter-onboarding-specialty-note',
	},
	'time-range': {
		key: 'jupiter.notes.time-range',
		testId: 'jupiter-onboarding-time-range-note',
	},
	timezone: {
		key: 'jupiter.notes.timezone',
		testId: 'jupiter-onboarding-timezone-note',
		type: 'warning',
	},
	'working-days': {
		key: 'jupiter.notes.working-days',
		testId: 'jupiter-onboarding-working-days-note',
	},
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
		if (isCalendarConnected) return 'calendar-picker';
		if (saved) return saved.step;
		if (!userSpecialities?.length) return 'specialty';
		return 'calendar-choice';
	});
	const [answers, setAnswers] = useState<JupiterAnswers>(
		initialAnswers ?? saved?.answers ?? {}
	);
	const [messages, setMessages] = useState<JupiterMessage[]>([]);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [isLoadingCalendars, setIsLoadingCalendars] = useState(false);
	const [calendarList, setCalendarList] = useState<CalendarItem[]>([]);
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

	const buildStepNote = useCallback(
		(stepKey: JupiterStep): JupiterMessage['note'] | undefined => {
			const config = STEP_NOTE_CONFIG[stepKey];
			if (!config) return undefined;
			return { testId: config.testId, text: t(config.key), type: config.type };
		},
		[t]
	);

	// Rebuild the full conversation transcript (each bot question + the user's
	// answer bubble) from the persisted `answers`, so a returning user sees their
	// whole history — not a fresh step-by-step — with always-current copy. Only
	// the answered steps are emitted, in flow order.
	const buildTranscript = useCallback((): JupiterMessage[] => {
		const titleCase = (slug: string) =>
			slug
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');

		const messageLog: JupiterMessage[] = [];
		const pushQA = (
			questionKey: string,
			stepKey: JupiterStep,
			answer: string
		) => {
			messageLog.push({
				content: t(questionKey),
				note: buildStepNote(stepKey),
				sender: 'bot',
				showIcon: true,
			});
			messageLog.push({ content: answer, sender: 'user' });
		};

		if (answers.specialities?.length) {
			pushQA(
				'jupiter.specialty.response',
				'specialty',
				answers.specialities.map(titleCase).join(', ')
			);
		}
		if (answers.calendarChoice) {
			pushQA(
				'jupiter.calendar-choice.msg2',
				'calendar-choice',
				t(
					answers.calendarChoice === 'google'
						? 'jupiter.calendar-choice.chip-google'
						: 'jupiter.calendar-choice.chip-manual'
				)
			);
		}
		if (answers.workingDays?.length) {
			pushQA(
				'jupiter.working-days.response',
				'working-days',
				answers.workingDays.map((day) => t(`jupiter.days.${day}`)).join(', ')
			);
		}
		if (answers.timeRange) {
			pushQA('jupiter.time-range.response', 'time-range', answers.timeRange);
		}
		if (answers.sessionDuration) {
			pushQA(
				'jupiter.session-duration.response',
				'session-duration',
				answers.sessionDuration
			);
		}
		if (answers.sessionType) {
			pushQA(
				'jupiter.session-type.response',
				'session-type',
				t(`jupiter.session-type.${answers.sessionType}`)
			);
		}
		if (answers.timezone) {
			pushQA('jupiter.timezone.response', 'timezone', answers.timezone);
		}
		if (answers.recurrencePattern) {
			pushQA(
				'jupiter.recurrence-pattern.response',
				'recurrence-pattern',
				t(
					`jupiter.recurrence-pattern.value-${answers.recurrencePattern.toLowerCase()}`
				)
			);
		}

		return messageLog;
	}, [answers, buildStepNote, t]);

	const addBotMessage = useCallback(
		(content: string, showIcon = true, note?: JupiterMessage['note']) => {
			setMessages((prev) => [...prev, { content, note, sender: 'bot', showIcon }]);
		},
		[]
	);

	const addUserMessage = useCallback((content: string) => {
		setMessages((prev) => [...prev, { content, sender: 'user' }]);
	}, []);

	// Reveal a bot message after a typing pause (dots show while typing).
	const revealBotMessage = useCallback(
		(
			content: string,
			showIcon: boolean,
			note: JupiterMessage['note'] | undefined,
			onAfter?: () => void,
			delay = TYPING_DELAY
		) => {
			setIsBotTyping(true);
			setTimeout(() => {
				setIsBotTyping(false);
				addBotMessage(content, showIcon, note);
				onAfter?.();
			}, delay);
		},
		[addBotMessage]
	);

	// ─── Core transition helpers ───────────────────────────────────────────────

	const advance = useCallback(
		(botKey: string, nextStep: JupiterStep, delay = TYPING_DELAY) => {
			// Each question follows the user's answer, so it opens a new bot turn —
			// show the avatar (showIcon) so every turn reads like the preview.
			revealBotMessage(
				t(botKey),
				true,
				buildStepNote(nextStep),
				() => setStep(nextStep),
				delay
			);
		},
		[buildStepNote, revealBotMessage, t]
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

		if (hasInitialized.current) return;
		hasInitialized.current = true;

		// The Google OAuth round-trip reloads the page and wipes the in-memory
		// chat. Rebuild the conversation from saved answers and acknowledge the
		// connection so the user isn't dropped into an empty stream at the picker.
		setMessages(buildTranscript());
		addBotMessage(t('jupiter.google-calendar.connected'));
	}, [isCalendarConnected, buildTranscript, addBotMessage, setMessages, t]);

	// ─── Flow initialization ───────────────────────────────────────────────────

	const initFlow = useCallback(() => {
		if (hasInitialized.current) return;
		hasInitialized.current = true;

		if (saved) {
			// Rebuild the whole conversation from the saved answers so the returning
			// user sees their full history (questions + their answer bubbles) and
			// continues from the current step — never a fresh step-by-step. The
			// durable source of truth is `answers`, so the copy is always current.
			const transcript = buildTranscript();
			const questionKey = STEP_QUESTION_KEY[saved.step];

			if (transcript.length) {
				setMessages(transcript);
				if (questionKey) {
					// Follows the last answer bubble → new bot turn, show the avatar.
					revealBotMessage(t(questionKey), true, buildStepNote(saved.step));
				}
			} else {
				// Nothing answered yet — open with the greeting + current question.
				setMessages([
					{
						content: t('jupiter.calendar-choice.msg1'),
						sender: 'bot',
						showIcon: true,
					},
				]);
				if (questionKey) {
					revealBotMessage(t(questionKey), false, buildStepNote(saved.step));
				}
			}
			return;
		}

		addBotMessage(t('jupiter.calendar-choice.msg1'));
		const nextStep = !userSpecialities?.length ? 'specialty' : 'calendar-choice';
		revealBotMessage(
			t(
				!userSpecialities?.length
					? 'jupiter.specialty.response'
					: 'jupiter.calendar-choice.msg2'
			),
			false,
			buildStepNote(nextStep)
		);
	}, [
		addBotMessage,
		buildStepNote,
		buildTranscript,
		revealBotMessage,
		saved,
		setMessages,
		t,
		userSpecialities?.length,
	]);

	// ─── Step handlers ─────────────────────────────────────────────────────────

	const handleCalendarChoice = useCallback(
		async (key: string) => {
			if (key === 'google') {
				addUserMessage(t('jupiter.calendar-choice.chip-google'));
				setAnswers((prev) => ({
					...prev,
					availabilitySource: 'google-manual',
					calendarChoice: 'google',
				}));

				try {
					const status = await getGoogleCalendarStatus();
					if (status.connected) {
						revealBotMessage(
							t('jupiter.calendar-choice.google-already-connected'),
							true,
							undefined,
							() => setStep('google-success')
						);
						return;
					}
				} catch {
					// Status check failed — fall through to normal OAuth flow
				}

				setStep('google-permissions');
			} else {
				addUserMessage(t('jupiter.calendar-choice.chip-manual'));
				setAnswers((prev) => ({
					...prev,
					availabilitySource: 'manual',
					calendarChoice: 'manual',
				}));
				advance('jupiter.working-days.response', 'working-days');
			}
		},
		[addUserMessage, advance, revealBotMessage, t]
	);

	const handleWorkingDays = useCallback(
		(selectedKeys: string[]) => {
			const dayLabels = selectedKeys
				.map((key) => t(`jupiter.working-days.${key}`))
				.join(', ');
			const canonicalDays = selectedKeys.map((key) => WEEKDAY_KEY_MAP[key] ?? key);
			addUserMessage(dayLabels);
			setAnswers((prev) => ({ ...prev, workingDays: canonicalDays }));
			advance('jupiter.time-range.response', 'time-range');
		},
		[addUserMessage, advance, t]
	);

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
		async (canonicals: string[], displayLabel?: string) => {
			// Show the copy the user actually picked (chip labels), not the internal
			// canonical slugs. Free-text entries fall back to a readable form of the
			// canonical (e.g. "speech-therapist" → "Speech Therapist").
			const label =
				displayLabel ??
				canonicals
					.map((canonical) =>
						canonical
							.split('-')
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(' ')
					)
					.join(', ');
			addUserMessage(label);
			setAnswers((prev) => ({ ...prev, specialities: canonicals }));

			if (therapistId) {
				try {
					await editUserById({
						data: { specialities: canonicals },
						userId: therapistId,
					});
				} catch {
					// Non-critical — flow continues regardless
				}
			}

			const defaultSessionType =
				SPECIALTY_SESSION_TYPE_DEFAULTS[canonicals[0]] ??
				SPECIALTY_SESSION_TYPE_FALLBACK;
			setAnswers((prev) => ({ ...prev, sessionType: defaultSessionType }));

			addBotMessage(t('jupiter.specialty.acknowledged'));
			revealBotMessage(
				t('jupiter.calendar-choice.msg2'),
				false,
				buildStepNote('calendar-choice'),
				() => setStep('calendar-choice')
			);
		},
		[
			addBotMessage,
			addUserMessage,
			buildStepNote,
			revealBotMessage,
			therapistId,
			t,
		]
	);

	const handleSpecialty = useCallback(
		(selectedKeys: string[]) => {
			const canonicals = selectedKeys.map(
				(k) => SPECIALTY_CHIP_KEY_MAP[k] ?? k.replace('chip-', '')
			);
			const displayLabel = selectedKeys
				.map((k) => t(`jupiter.specialty.${k}`))
				.join(', ');
			commitSpecialities(canonicals, displayLabel);
		},
		[commitSpecialities, t]
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

	const handleSessionDuration = useCallback(
		(label: string) => {
			const hasSpecialityDefault =
				answers.specialities?.length &&
				SPECIALTY_SESSION_TYPE_DEFAULTS[answers.specialities[0]];
			const sessionTypeResponseKey = hasSpecialityDefault
				? 'jupiter.session-type.response-with-suggestion'
				: 'jupiter.session-type.response';
			commit(
				label,
				'sessionDuration',
				label,
				sessionTypeResponseKey,
				'session-type'
			);
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

	const advanceAfterTimezone = useCallback(() => {
		// Read recurrencePattern from the current closure — NOT from inside a
		// setAnswers updater. Updater functions must be pure; React can invoke them
		// more than once (e.g. StrictMode), which would fire the reveal twice and
		// duplicate the summary bubble.
		if (answers.recurrencePattern) {
			// Recurrence is already known (e.g. inferred from the Google import), so
			// skip the question and go straight to the summary + preview.
			const summaryKey =
				answers.recurrencePattern === 'WEEKLY'
					? 'jupiter.recurrence-pattern.summary-weekly'
					: 'jupiter.recurrence-pattern.summary-monthly';
			// Follows the timezone answer → new bot turn, so show the avatar.
			revealBotMessage(t(summaryKey), true, buildStepNote('preview'), () =>
				setStep('preview')
			);
		} else {
			revealBotMessage(
				t('jupiter.recurrence-pattern.response'),
				true,
				buildStepNote('recurrence-pattern'),
				() => setStep('recurrence-pattern')
			);
		}
	}, [answers.recurrencePattern, buildStepNote, revealBotMessage, t]);

	const handleTimezone = useCallback(
		(key: string) => {
			if (key === 'chip-yes') {
				addUserMessage(t('jupiter.timezone.chip-yes'));
				setAnswers((prev) => ({
					...prev,
					timezone: detectedTimezone,
					timezoneConfirmed: true,
				}));
				advanceAfterTimezone();
			} else {
				addUserMessage(t('jupiter.timezone.chip-no'));
				addBotMessage(t('jupiter.timezone.follow-up'));
				setAnswers((prev) => ({ ...prev, timezoneConfirmed: false }));
			}
		},
		[addBotMessage, addUserMessage, advanceAfterTimezone, detectedTimezone, t]
	);

	const handleTimezoneSelect = useCallback(
		(tz: string) => {
			addUserMessage(tz);
			setAnswers((prev) => ({ ...prev, timezone: tz }));
			advanceAfterTimezone();
		},
		[addUserMessage, advanceAfterTimezone]
	);

	const handleRecurrencePattern = useCallback(
		(key: string) => {
			const value: RecurrencePattern =
				key === 'chip-weekly' ? 'WEEKLY' : 'MONTHLY';
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

	// Bounded client-side retry of the Google busy-time sync after a publish that
	// came back calendarSynced=false. Returns true on the first successful sync.
	const retryCalendarSync = useCallback(async (): Promise<boolean> => {
		const MAX_ATTEMPTS = 2;
		const RETRY_DELAY = 1200;
		for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
			try {
				await syncGoogleCalendar();
				queryClient.invalidateQueries({
					queryKey: QUERY_KEYS.therapistAvailability(therapistId),
				});
				return true;
			} catch {
				if (attempt < MAX_ATTEMPTS - 1) {
					await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				}
			}
		}
		return false;
	}, [queryClient, therapistId]);

	// Lands the user on the live availability page once we're done here.
	const goToAvailability = useCallback(() => {
		showAlert({
			message: t('jupiter.post-publish.welcome-toast'),
			severity: 'success',
		});
		navigate(`/${i18n.language}/${AVAILABILITYPATH}`);
	}, [i18n.language, navigate, showAlert, t]);

	const handlePublish =
		useCallback(async (): Promise<JupiterPublishOutcome> => {
			if (
				!answers.workingDays?.length ||
				!answers.timeRange ||
				!answers.sessionDuration ||
				!answers.sessionType ||
				!answers.timezone ||
				!answers.recurrencePattern
			)
				return 'failed';

			setIsPublishing(true);
			try {
				const { availabilityId, calendarSynced } =
					await generateJupiterAvailability({
						recurrencePattern: answers.recurrencePattern,
						workingDays: answers.workingDays,
						timeRange: answers.timeRange,
						sessionDuration: answers.sessionDuration,
						sessionType: answers.sessionType,
						timezone: answers.timezone,
					});
				localStorage.removeItem(STORAGE_KEY);
				localStorage.setItem(ONBOARDING_KEY, 'true');
				localStorage.setItem(PUBLISHED_KEY, 'true');
				const record: IAvailabilityRecord = {
					availabilityId,
					recurrencePattern: answers.recurrencePattern,
					sessionDuration: answers.sessionDuration,
					sessionType: answers.sessionType,
					timeRange: answers.timeRange,
					timezone: answers.timezone,
					workingDays: answers.workingDays,
				};
				queryClient.setQueryData<IAvailabilityRecord>(['availability'], record);
				queryClient.setQueryData<IAvailabilityRecord>(
					['availabilityGate'],
					record
				);
				queryClient.invalidateQueries({
					queryKey: QUERY_KEYS.therapistAvailability(therapistId),
				});
				// Refetch the data the availability page actually renders from — the
				// config (['availability']) and, crucially, the week-grid slots
				// (['jupiterAvailability', …]) — so it populates on first paint after
				// navigation instead of showing the stale (empty) cache until reload.
				queryClient.invalidateQueries({ queryKey: ['availability'] });
				queryClient.invalidateQueries({ queryKey: ['jupiterAvailability'] });
				// Refresh the Practice Importer preview so the "patients found in
				// your calendar" prompt reflects the freshly-synced events.
				queryClient.invalidateQueries({ queryKey: ['practiceImportPreview'] });

				// The publish itself succeeded (the availability doc is saved). For a
				// Google-connected therapist, the BE also tries to pull busy times
				// synchronously and reports it via calendarSynced. If that failed
				// (transient Google/token hiccup), retry the sync from the client a
				// couple of times. If it still fails, stay on this page as
				// 'sync-pending' so the user can retry in place rather than being
				// sent away to Settings.
				const isGoogleConnected =
					answers.availabilitySource === 'google-import' ||
					answers.availabilitySource === 'google-manual';
				let synced = calendarSynced ?? false;
				if (isGoogleConnected && !synced) {
					synced = await retryCalendarSync();
				}

				if (isGoogleConnected && !synced) {
					showAlert({
						message: t('jupiter.post-publish.sync-pending-toast'),
						severity: 'warning',
					});
					return 'sync-pending';
				}

				showAlert({
					message: t('jupiter.post-publish.success-toast'),
					severity: 'success',
				});
				goToAvailability();
				return 'published';
			} catch {
				addBotMessage(t('jupiter.errors.save-fail'));
				return 'failed';
			} finally {
				setIsPublishing(false);
			}
		}, [
			answers,
			addBotMessage,
			goToAvailability,
			queryClient,
			retryCalendarSync,
			showAlert,
			t,
			therapistId,
		]);

	// Retry the Google sync from the 'sync-pending' state. On success we surface
	// the normal success toast and continue to availability; otherwise we stay
	// put so the user can try again.
	const handleRetrySync = useCallback(async (): Promise<boolean> => {
		setIsPublishing(true);
		try {
			const synced = await retryCalendarSync();
			if (synced) {
				showAlert({
					message: t('jupiter.post-publish.success-toast'),
					severity: 'success',
				});
				goToAvailability();
			} else {
				showAlert({
					message: t('jupiter.post-publish.sync-pending-toast'),
					severity: 'warning',
				});
			}
			return synced;
		} finally {
			setIsPublishing(false);
		}
	}, [goToAvailability, retryCalendarSync, showAlert, t]);

	// User chooses to leave the 'sync-pending' state without a successful sync.
	const handleContinueWithoutSync = useCallback(() => {
		goToAvailability();
	}, [goToAvailability]);

	const handleReset = useCallback(() => {
		localStorage.removeItem(STORAGE_KEY);
		setStep('calendar-choice');
		setAnswers({});
		setMessages([
			{
				content: t('jupiter.calendar-choice.msg2'),
				note: buildStepNote('calendar-choice'),
				sender: 'bot',
				showIcon: true,
			},
		]);
		hasInitialized.current = true;
	}, [buildStepNote, t]);

	// ─── Calendar picker ───────────────────────────────────────────────────────

	// Emit the post-connect bubbles into the conversation stream, then move to the
	// google-success step (whose dock control is the use-existing/scratch chips).
	const enterGoogleSuccess = useCallback(
		(pickedCalendarName?: string) => {
			if (pickedCalendarName) addUserMessage(pickedCalendarName);
			addBotMessage(t('jupiter.google-calendar.success-line1'));
			addBotMessage(t('jupiter.google-calendar.next-choice'), false, {
				testId: 'jupiter-onboarding-google-source-choice-note',
				text: t('jupiter.notes.google-source-choice'),
				type: 'google',
			});
			setStep('google-success');
		},
		[addBotMessage, addUserMessage, t]
	);

	useEffect(() => {
		if (step !== 'calendar-picker') return;

		setIsLoadingCalendars(true);
		getGoogleCalendarList()
			.then((calendars) => {
				if (calendars.length <= 1) {
					const calendar = calendars[0];
					const id = calendar?.id ?? 'primary';
					setAnswers((prev) => ({
						...prev,
						selectedCalendarId: id,
						selectedCalendarName:
							calendar?.summary ?? t('jupiter.preview.calendar-fallback'),
					}));
					selectGoogleCalendar(id).catch(() => {
						// Non-critical — continue regardless
					});
					enterGoogleSuccess();
					return;
				}
				setCalendarList(calendars);
			})
			.catch(() => {
				enterGoogleSuccess();
			})
			.finally(() => setIsLoadingCalendars(false));
	}, [enterGoogleSuccess, step, t]);

	const handleCalendarPicked = useCallback(
		async (calendarId: string) => {
			const calendar = calendarList.find((item) => item.id === calendarId);
			const calendarName =
				calendar?.summary ?? t('jupiter.preview.calendar-fallback');
			setAnswers((prev) => ({
				...prev,
				selectedCalendarId: calendarId,
				selectedCalendarName: calendarName,
			}));
			try {
				await selectGoogleCalendar(calendarId);
			} catch {
				// Non-critical — continue regardless
			}
			enterGoogleSuccess(calendarName);
		},
		[calendarList, enterGoogleSuccess, t]
	);

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

				try {
					const schedule = await importGoogleCalendarSchedule();
					setIsImporting(false);

					if (schedule && schedule.workingDays.length > 0) {
						const timeRange = `${schedule.startTime} - ${schedule.endTime}`;
						const updatedAnswers: Partial<JupiterAnswers> = {
							availabilitySource: 'google-import',
							workingDays: schedule.workingDays,
							timeRange,
							// Imported availability repeats weekly until end of month by
							// default (unless the calendar itself defines a pattern).
							recurrencePattern: schedule.recurrencePattern ?? 'WEEKLY',
						};
						setAnswers((prev) => ({ ...prev, ...updatedAnswers }));

						const dayLabels = schedule.workingDays
							.map((d) => {
								const chipKey = CANONICAL_TO_CHIP[d];
								return chipKey ? t(`jupiter.working-days.${chipKey}`) : d;
							})
							.join(', ');

						revealBotMessage(
							t('jupiter.google-calendar.imported-summary', {
								days: dayLabels,
								hours: timeRange,
							}),
							false,
							{
								testId: 'jupiter-onboarding-import-flag',
								text: t('jupiter.notes.imported-from-calendar', {
									calendar:
										answers.selectedCalendarName ??
										t('jupiter.preview.calendar-fallback'),
								}),
								type: 'success',
							},
							() =>
								revealBotMessage(
									t('jupiter.session-duration.response'),
									false,
									buildStepNote('session-duration'),
									() => setStep('session-duration')
								)
						);
					} else {
						revealBotMessage(
							t('jupiter.google-calendar.import-failed'),
							false,
							undefined,
							() =>
								revealBotMessage(
									t('jupiter.working-days.response'),
									false,
									buildStepNote('working-days'),
									() => setStep('working-days')
								)
						);
					}
				} catch {
					setIsImporting(false);
					revealBotMessage(
						t('jupiter.google-calendar.import-failed'),
						false,
						undefined,
						() =>
							revealBotMessage(
								t('jupiter.working-days.response'),
								false,
								buildStepNote('working-days'),
								() => setStep('working-days')
							)
					);
				}
			} else {
				setAnswers((prev) => ({ ...prev, availabilitySource: 'google-manual' }));
				advance('jupiter.working-days.response', 'working-days');
			}
		},
		[
			addBotMessage,
			addUserMessage,
			advance,
			answers.selectedCalendarName,
			buildStepNote,
			revealBotMessage,
			t,
		]
	);

	return {
		step,
		answers,
		messages,
		calendarList,
		isBotTyping,
		isImporting,
		isLoadingCalendars,
		isPublishing,
		specialityKey,
		workingDaysKey,
		detectedTimezone,
		initFlow,
		handleCalendarChoice,
		handleCalendarPicked,
		handleGoogleBack,
		handleGoogleContinue,
		handleContinueWithoutSync,
		handleGooglePostConnect,
		handlePublish,
		handleRecurrencePattern,
		handleReset,
		handleRetrySync,
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
