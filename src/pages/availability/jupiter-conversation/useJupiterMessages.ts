import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { slugToTitleCase } from '@psycron/utils/string/string.utils';

import type { StatusNoteType } from './status-note/StatusNote.types';
import type {
	JupiterAnswers,
	JupiterMessage,
	JupiterStep,
} from './JupiterConversation.types';
import { TYPING_DELAY } from './jupiterFlow.constants';

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

/**
 * Owns the conversation stream: the message log, the typing indicator, and the
 * helpers that append / reveal bot and user bubbles. Also rebuilds the full
 * transcript from persisted `answers` so a returning user sees their history.
 * No step or answer mutation lives here — callers pass an `onAfter` callback to
 * `revealBotMessage` to drive the flow.
 */
export const useJupiterMessages = (answers: JupiterAnswers) => {
	const { t } = useTranslation();

	const [messages, setMessages] = useState<JupiterMessage[]>([]);
	const [isBotTyping, setIsBotTyping] = useState(false);

	const buildStepNote = useCallback(
		(stepKey: JupiterStep): JupiterMessage['note'] | undefined => {
			const config = STEP_NOTE_CONFIG[stepKey];
			if (!config) return undefined;
			return { testId: config.testId, text: t(config.key), type: config.type };
		},
		[t]
	);

	const addBotMessage = useCallback(
		(content: string, showIcon = true, note?: JupiterMessage['note']) => {
			setMessages((prev) => [
				...prev,
				{ content, note, sender: 'bot', showIcon },
			]);
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

	// Rebuild the full conversation transcript (each bot question + the user's
	// answer bubble) from the persisted `answers`, so a returning user sees their
	// whole history — not a fresh step-by-step — with always-current copy. Only
	// the answered steps are emitted, in flow order.
	const buildTranscript = useCallback((): JupiterMessage[] => {
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
				answers.specialities.map(slugToTitleCase).join(', ')
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

	return {
		messages,
		setMessages,
		isBotTyping,
		addBotMessage,
		addUserMessage,
		revealBotMessage,
		buildStepNote,
		buildTranscript,
	};
};

export type JupiterMessagesApi = ReturnType<typeof useJupiterMessages>;
