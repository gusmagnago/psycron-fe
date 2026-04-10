import type { IConflict } from '@psycron/api/user/conflicts/index.types';

const now = '2026-04-10T10:30:00.000Z';

export const mockedConflicts: IConflict[] = [
	{
		_id: 'mock-slot-replication-open',
		actionTaken: null,
		createdAt: now,
		description:
			'A recurring booking could not be replicated because the target slot is already occupied.',
		metadata: {
			conflictingDate: '2026-04-15T00:00:00.000Z',
			conflictingPatientId: 'patient-002',
			conflictingStartTime: '14:30',
			conflictingStatus: 'BOOKED',
			dayId: 'day-001',
			originalPatientId: 'patient-001',
			recurrencePattern: 'Every Wednesday',
			slotId: 'slot-001',
		},
		resolvedAt: null,
		status: 'OPEN',
		therapistId: 'mock-therapist',
		title: 'Recurring booking hit an occupied slot',
		type: 'SLOT_REPLICATION',
		updatedAt: now,
	},
	{
		_id: 'mock-patient-duplicate-open',
		actionTaken: null,
		createdAt: now,
		description:
			'This patient may already exist in your records. Review the match before continuing.',
		metadata: {
			candidatePatients: [
				{
					_id: 'patient-existing-001',
					firstName: 'Maria',
					lastName: 'Silva',
				},
				{
					_id: 'patient-existing-002',
					firstName: 'Maria',
					lastName: 'Santos',
				},
			],
			contacts: {
				email: 'maria@example.com',
				phone: '+351912345678',
			},
			incomingPatient: {
				firstName: 'Maria',
				lastName: 'Silva',
			},
			match: 'multiple',
		},
		resolvedAt: null,
		status: 'OPEN',
		therapistId: 'mock-therapist',
		title: 'Possible duplicate patient detected',
		type: 'PATIENT_DUPLICATE',
		updatedAt: now,
	},
	{
		_id: 'mock-patient-duplicate-resolved',
		actionTaken: 'KEEP_EXISTING_PATIENT',
		createdAt: '2026-04-08T08:00:00.000Z',
		description:
			'A duplicate patient match was reviewed and resolved in favor of the existing record.',
		metadata: {
			candidatePatients: [
				{
					_id: 'patient-existing-003',
					firstName: 'Joao',
					lastName: 'Costa',
				},
			],
			contacts: {
				email: 'joao@example.com',
			},
			incomingPatient: {
				firstName: 'Joao',
				lastName: 'Costa',
			},
			match: 'single',
		},
		resolvedAt: '2026-04-08T09:15:00.000Z',
		status: 'RESOLVED',
		therapistId: 'mock-therapist',
		title: 'Duplicate patient reviewed',
		type: 'PATIENT_DUPLICATE',
		updatedAt: '2026-04-08T09:15:00.000Z',
	},
];
