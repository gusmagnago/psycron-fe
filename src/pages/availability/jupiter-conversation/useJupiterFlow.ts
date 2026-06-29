import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getGoogleCalendarStatus } from '@psycron/api/auth';
import { type RecurrencePattern } from '@psycron/api/jupiter';
import { editUserById } from '@psycron/api/user';
import { slugToTitleCase } from '@psycron/utils/string/string.utils';

import type {
	JupiterAnswers,
	JupiterStep,
} from './JupiterConversation.types';
import {
	CANONICAL_TO_CHIP,
	loadSaved,
	SESSION_TYPE_CANONICAL,
	STEP_QUESTION_KEY,
	STORAGE_KEY,
	WEEKDAY_KEY_MAP,
} from './jupiterFlow.constants';
import {
	SPECIALTY_CHIP_KEY_MAP,
	SPECIALTY_SESSION_TYPE_DEFAULTS,
	SPECIALTY_SESSION_TYPE_FALLBACK,
} from './jupiterSpecialtyDefaults';
import { useGoogleCalendarOnboarding } from './useGoogleCalendarOnboarding';
import { useJupiterMessages } from './useJupiterMessages';
import { useJupiterPublish } from './useJupiterPublish';

// Re-exported for consumers that read the onboarding/draft flags directly
// (AvailabilityGate, useAvailabilitySettings).
export {
	ONBOARDING_KEY,
	PUBLISHED_KEY,
	STORAGE_KEY,
} from './jupiterFlow.constants';

interface UseJupiterFlowOptions {
	initialAnswers?: JupiterAnswers;
	therapistId?: string;
	userSpecialities?: string[];
}

/**
 * Orchestrates the Jupiter onboarding conversation: owns step + answers state
 * and the per-step handlers, and composes the focused sub-hooks for the message
 * stream ([[useJupiterMessages]]), publishing ([[useJupiterPublish]]) and the
 * Google path ([[useGoogleCalendarOnboarding]]).
 */
export const useJupiterFlow = ({
	initialAnswers,
	therapistId,
	userSpecialities,
}: UseJupiterFlowOptions = {}) => {
	const { t } = useTranslation();

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

	const {
		messages,
		setMessages,
		isBotTyping,
		addBotMessage,
		addUserMessage,
		revealBotMessage,
		buildStepNote,
		buildTranscript,
	} = useJupiterMessages(answers);

	const { isPublishing, handlePublish, handleRetrySync, handleContinueWithoutSync } =
		useJupiterPublish({ answers, therapistId, addBotMessage });

	// ─── Core transition helpers ───────────────────────────────────────────────

	const advance = useCallback(
		(botKey: string, nextStep: JupiterStep, delay?: number) => {
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

	const {
		calendarList,
		isImporting,
		isLoadingCalendars,
		handleCalendarPicked,
		handleGoogleContinue,
		handleGoogleBack,
		handleGooglePostConnect,
	} = useGoogleCalendarOnboarding({
		step,
		setStep,
		answers,
		setAnswers,
		addBotMessage,
		addUserMessage,
		revealBotMessage,
		buildStepNote,
		advance,
	});

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
			const label = displayLabel ?? canonicals.map(slugToTitleCase).join(', ');
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
	}, [buildStepNote, setMessages, t]);

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
