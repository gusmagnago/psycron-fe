import type {
	JupiterAnswers,
	JupiterStep,
} from './JupiterConversation.types';

export const STORAGE_KEY = '_psy_jd';
export const ONBOARDING_KEY = '_psy_ob';
export const PUBLISHED_KEY = '_psy_pub';

// Delay before a Jupiter reply lands, during which the typing dots show.
export const TYPING_DELAY = 600;

export const SESSION_TYPE_CANONICAL: Record<string, string> = {
	'chip-both': 'BOTH',
	'chip-in-person': 'IN_PERSON',
	'chip-online': 'ONLINE',
};

export const WEEKDAY_KEY_MAP: Record<string, string> = {
	'chip-fri': 'FRIDAY',
	'chip-mon': 'MONDAY',
	'chip-sat': 'SATURDAY',
	'chip-sun': 'SUNDAY',
	'chip-thu': 'THURSDAY',
	'chip-tue': 'TUESDAY',
	'chip-wed': 'WEDNESDAY',
};

export const CANONICAL_TO_CHIP: Record<string, string> = {
	FRIDAY: 'chip-fri',
	MONDAY: 'chip-mon',
	SATURDAY: 'chip-sat',
	SUNDAY: 'chip-sun',
	THURSDAY: 'chip-thu',
	TUESDAY: 'chip-tue',
	WEDNESDAY: 'chip-wed',
};

export const STEP_QUESTION_KEY: Partial<Record<JupiterStep, string>> = {
	'calendar-choice': 'jupiter.calendar-choice.msg2',
	'recurrence-pattern': 'jupiter.recurrence-pattern.response',
	'session-duration': 'jupiter.session-duration.response',
	'session-type': 'jupiter.session-type.response',
	specialty: 'jupiter.specialty.response',
	'time-range': 'jupiter.time-range.response',
	timezone: 'jupiter.timezone.response',
	'working-days': 'jupiter.working-days.response',
};

const VALID_SESSION_TYPE_KEYS = new Set([
	'chip-online',
	'chip-in-person',
	'chip-both',
]);

// One-time migration from legacy readable localStorage keys.
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

export const loadSaved = (): {
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
