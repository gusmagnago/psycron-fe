import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
	readPatientWorkspacePreferences,
	writePatientWorkspacePreferences,
} from './patientWorkspaceStorage';

// The vitest environment is 'node', so there is no localStorage to speak of.
const createStorageMock = () => {
	const entries = new Map<string, string>();
	return {
		clear: () => entries.clear(),
		getItem: (key: string) => entries.get(key) ?? null,
		key: (index: number) => [...entries.keys()][index] ?? null,
		get length() {
			return entries.size;
		},
		removeItem: (key: string) => entries.delete(key),
		setItem: (key: string, value: string) => entries.set(key, value),
	};
};

let storage: ReturnType<typeof createStorageMock>;

beforeEach(() => {
	storage = createStorageMock();
	vi.stubGlobal('localStorage', storage);
});

describe('readPatientWorkspacePreferences', () => {
	it('returns an empty record when nothing is stored', () => {
		expect(readPatientWorkspacePreferences()).toEqual({});
	});

	it('migrates all three legacy keys into the v2 record', () => {
		storage.setItem('_psy_pq_v1', 'billing');
		storage.setItem('_psy_pc_v1', JSON.stringify(['patient', 'billing']));
		storage.setItem(
			'_psy_patients_ui_v1',
			JSON.stringify({
				isWorkQueuesExpanded: false,
				isWorkspaceControlsExpanded: true,
			})
		);

		expect(readPatientWorkspacePreferences()).toEqual({
			columns: ['patient', 'billing'],
			isWorkQueuesExpanded: false,
			isWorkspaceControlsExpanded: true,
			queue: 'billing',
		});
	});

	it('clears the legacy keys once migrated, and does not re-migrate', () => {
		storage.setItem('_psy_pq_v1', 'recovery');
		readPatientWorkspacePreferences();

		expect(storage.getItem('_psy_pq_v1')).toBeNull();
		expect(storage.getItem('_psy_patients_workspace_v2')).not.toBeNull();

		// A later write must win over the migrated value rather than be undone
		// by a second migration pass.
		writePatientWorkspacePreferences({ queue: 'all' });
		expect(readPatientWorkspacePreferences().queue).toBe('all');
	});

	it('migrates the keys that exist and ignores malformed ones', () => {
		storage.setItem('_psy_pq_v1', 'contact');
		storage.setItem('_psy_pc_v1', 'not json at all');
		storage.setItem('_psy_patients_ui_v1', JSON.stringify({ nonsense: 1 }));

		expect(readPatientWorkspacePreferences()).toEqual({ queue: 'contact' });
	});

	it('survives a malformed v2 record instead of throwing', () => {
		storage.setItem('_psy_patients_workspace_v2', '{{{');
		expect(readPatientWorkspacePreferences()).toEqual({});
	});
});

describe('writePatientWorkspacePreferences', () => {
	it('merges a slice without clobbering the others', () => {
		writePatientWorkspacePreferences({ queue: 'billing' });
		writePatientWorkspacePreferences({ columns: ['patient'] });
		writePatientWorkspacePreferences({ isWorkQueuesExpanded: false });

		expect(readPatientWorkspacePreferences()).toEqual({
			columns: ['patient'],
			isWorkQueuesExpanded: false,
			queue: 'billing',
		});
	});

	it('does not throw when storage is unavailable', () => {
		vi.stubGlobal('localStorage', {
			getItem: (): string => {
				throw new Error('SecurityError');
			},
			removeItem: (): void => undefined,
			setItem: (): void => {
				throw new Error('QuotaExceededError');
			},
		});

		expect(() =>
			writePatientWorkspacePreferences({ queue: 'all' })
		).not.toThrow();
		expect(readPatientWorkspacePreferences()).toEqual({});
	});
});
