import type {
	PatientWorkspaceColumn,
	PatientWorkspaceQueue,
} from './PatientsPage.types';

/**
 * One versioned store for every patient-workspace UI preference, replacing the
 * three ad-hoc keys this page used to write independently (`_psy_pq_v1`,
 * `_psy_patients_ui_v1`, `_psy_pc_v1`).
 *
 * LGPD/GDPR: UI preferences only — queue selection, column visibility, panel
 * expansion. Never patient data, identifiers, or anything derived from them.
 */
const STORAGE_KEY = '_psy_patients_workspace_v2';

const LEGACY_KEYS = {
	columns: '_psy_pc_v1',
	queue: '_psy_pq_v1',
	ui: '_psy_patients_ui_v1',
} as const;

export interface PatientWorkspacePreferences {
	columns: PatientWorkspaceColumn[];
	isWorkQueuesExpanded: boolean;
	isWorkspaceControlsExpanded: boolean;
	queue: PatientWorkspaceQueue;
}

/**
 * Every field is optional on read: a stored record may predate a field, and
 * each caller owns the default for its own slice (the controls-expanded
 * default, for one, depends on viewport).
 */
export type StoredPatientWorkspacePreferences =
	Partial<PatientWorkspacePreferences>;

const readJson = (key: string): unknown => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : undefined;
	} catch {
		return undefined;
	}
};

/**
 * Folds the three legacy keys into the v2 record on first read, then clears
 * them. Without this a user's saved queue, columns and panel state would all
 * silently reset to defaults on deploy.
 */
const migrateLegacyKeys = (): StoredPatientWorkspacePreferences => {
	const migrated: StoredPatientWorkspacePreferences = {};

	try {
		const storedQueue = localStorage.getItem(LEGACY_KEYS.queue);
		if (storedQueue) migrated.queue = storedQueue as PatientWorkspaceQueue;

		const storedColumns = readJson(LEGACY_KEYS.columns);
		if (Array.isArray(storedColumns)) {
			migrated.columns = storedColumns as PatientWorkspaceColumn[];
		}

		const storedUi = readJson(LEGACY_KEYS.ui);
		if (storedUi && typeof storedUi === 'object') {
			const ui = storedUi as Record<string, unknown>;
			if (typeof ui.isWorkspaceControlsExpanded === 'boolean') {
				migrated.isWorkspaceControlsExpanded = ui.isWorkspaceControlsExpanded;
			}
			if (typeof ui.isWorkQueuesExpanded === 'boolean') {
				migrated.isWorkQueuesExpanded = ui.isWorkQueuesExpanded;
			}
		}

		if (Object.keys(migrated).length > 0) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
		}
		for (const key of Object.values(LEGACY_KEYS)) localStorage.removeItem(key);
	} catch {
		// Preferences are a convenience; storage being unavailable is not fatal.
	}

	return migrated;
};

export const readPatientWorkspacePreferences =
	(): StoredPatientWorkspacePreferences => {
		const stored = readJson(STORAGE_KEY);
		if (stored && typeof stored === 'object') {
			return stored as StoredPatientWorkspacePreferences;
		}
		return migrateLegacyKeys();
	};

/**
 * Merges a slice into the stored record. Read-modify-write so three independent
 * hooks can each own their own field without clobbering the others.
 */
export const writePatientWorkspacePreferences = (
	patch: StoredPatientWorkspacePreferences
): void => {
	try {
		const current = readPatientWorkspacePreferences();
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
	} catch {
		// Preferences remain functional in-session when storage is unavailable.
	}
};
