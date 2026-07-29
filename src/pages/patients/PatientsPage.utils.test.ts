import type { IPatientWorkspaceSummary } from '@psycron/api/patient/index.types';
import { describe, expect, it } from 'vitest';

import { getPatientWorkspaceQueueCount } from './PatientListPage.utils';
import {
	getPatientNextAction,
	getPatientNextSessionState,
} from './PatientsPage.utils';

describe('getPatientNextAction', () => {
	const base = {
		billingConfigured: true,
		hasContact: true,
		hasFutureSession: true,
		isPossibleDuplicate: false,
		unresolvedCancelledSessions: 0,
	};

	it('prioritises duplicate review above everything else', () => {
		expect(
			getPatientNextAction({
				...base,
				billingConfigured: false,
				hasContact: false,
				isPossibleDuplicate: true,
				unresolvedCancelledSessions: 3,
			})
		).toBe('review-duplicate');
	});

	it('flags follow-up when there are unresolved cancellations', () => {
		expect(
			getPatientNextAction({ ...base, unresolvedCancelledSessions: 1 })
		).toBe('send-follow-up');
	});

	it('asks for contact and billing when both are missing', () => {
		expect(
			getPatientNextAction({
				...base,
				billingConfigured: false,
				hasContact: false,
			})
		).toBe('add-contact-and-billing');
	});

	it('asks for contact when only contact is missing', () => {
		expect(getPatientNextAction({ ...base, hasContact: false })).toBe(
			'add-contact'
		);
	});

	it('asks for billing when only billing is missing', () => {
		expect(getPatientNextAction({ ...base, billingConfigured: false })).toBe(
			'set-billing'
		);
	});

	it('asks to review scheduling when there is no future session', () => {
		expect(getPatientNextAction({ ...base, hasFutureSession: false })).toBe(
			'review-scheduling'
		);
	});

	it('is ready when nothing needs attention', () => {
		expect(getPatientNextAction(base)).toBe('ready');
	});
});

describe('getPatientNextSessionState', () => {
	const now = new Date('2026-07-24T12:00:00.000Z');
	const at = (isoMinutesFromNow: number): string =>
		new Date(now.getTime() + isoMinutesFromNow * 60_000).toISOString();

	it('returns "none" without a next session', () => {
		expect(getPatientNextSessionState(null, now)).toBe('none');
	});

	it('returns "now" for a session that just started (within the hour)', () => {
		expect(getPatientNextSessionState(at(-10), now)).toBe('now');
	});

	it('returns "normal" for a session that started over an hour ago', () => {
		expect(getPatientNextSessionState(at(-90), now)).toBe('normal');
	});

	it('returns "imminent" under 15 minutes out', () => {
		expect(getPatientNextSessionState(at(5), now)).toBe('imminent');
	});

	it('returns "approaching" between 15 and 120 minutes out', () => {
		expect(getPatientNextSessionState(at(30), now)).toBe('approaching');
		expect(getPatientNextSessionState(at(120), now)).toBe('approaching');
	});

	it('returns "normal" beyond two hours out', () => {
		expect(getPatientNextSessionState(at(121), now)).toBe('normal');
	});
});

describe('getPatientWorkspaceQueueCount', () => {
	const summary: IPatientWorkspaceSummary = {
		billing: 4,
		duplicate: 1,
		missingContact: 7,
		needsAttention: 9,
		recovery: 2,
	};

	it('maps each queue key to its authoritative count', () => {
		expect(getPatientWorkspaceQueueCount(summary, 'billing')).toBe(4);
		expect(getPatientWorkspaceQueueCount(summary, 'contact')).toBe(7);
		expect(getPatientWorkspaceQueueCount(summary, 'duplicate')).toBe(1);
		expect(getPatientWorkspaceQueueCount(summary, 'needs-attention')).toBe(9);
		expect(getPatientWorkspaceQueueCount(summary, 'recovery')).toBe(2);
	});
});
