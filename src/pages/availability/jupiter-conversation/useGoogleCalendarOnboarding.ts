import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CalendarItem } from '@psycron/api/auth';
import {
	getGoogleCalendarConnectUrl,
	getGoogleCalendarList,
	selectGoogleCalendar,
} from '@psycron/api/auth';
import { importGoogleCalendarSchedule } from '@psycron/api/jupiter';
import { AVAILABILITYGENERATE } from '@psycron/pages/urls';

import type {
	JupiterAnswers,
	JupiterMessage,
	JupiterStep,
} from './JupiterConversation.types';
import { CANONICAL_TO_CHIP } from './jupiterFlow.constants';

interface UseGoogleCalendarOnboardingParams {
	addBotMessage: (
		content: string,
		showIcon?: boolean,
		note?: JupiterMessage['note']
	) => void;
	addUserMessage: (content: string) => void;
	advance: (botKey: string, nextStep: JupiterStep, delay?: number) => void;
	answers: JupiterAnswers;
	buildStepNote: (stepKey: JupiterStep) => JupiterMessage['note'] | undefined;
	revealBotMessage: (
		content: string,
		showIcon: boolean,
		note: JupiterMessage['note'] | undefined,
		onAfter?: () => void,
		delay?: number
	) => void;
	setAnswers: Dispatch<SetStateAction<JupiterAnswers>>;
	setStep: Dispatch<SetStateAction<JupiterStep>>;
	step: JupiterStep;
}

/**
 * Owns the Google Calendar onboarding path: the connect redirect, the calendar
 * picker (load + auto-select), and the "use existing schedule" import that
 * pre-fills working days / hours / recurrence. Drives the conversation through
 * the messages + `advance` helpers it is handed.
 */
export const useGoogleCalendarOnboarding = ({
	step,
	setStep,
	answers,
	setAnswers,
	addBotMessage,
	addUserMessage,
	revealBotMessage,
	buildStepNote,
	advance,
}: UseGoogleCalendarOnboardingParams) => {
	const { t, i18n } = useTranslation();

	const [isImporting, setIsImporting] = useState(false);
	const [isLoadingCalendars, setIsLoadingCalendars] = useState(false);
	const [calendarList, setCalendarList] = useState<CalendarItem[]>([]);

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
		[addBotMessage, addUserMessage, setStep, t]
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
	}, [enterGoogleSuccess, setAnswers, step, t]);

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
		[calendarList, enterGoogleSuccess, setAnswers, t]
	);

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

	const handleGoogleBack = useCallback(
		() => setStep('calendar-choice'),
		[setStep]
	);

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
			setAnswers,
			setStep,
			t,
		]
	);

	return {
		calendarList,
		isImporting,
		isLoadingCalendars,
		handleCalendarPicked,
		handleGoogleContinue,
		handleGoogleBack,
		handleGooglePostConnect,
	};
};
