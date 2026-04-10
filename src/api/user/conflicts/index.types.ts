export type ConflictType = 'SLOT_REPLICATION' | 'PATIENT_DUPLICATE';
export type ConflictStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

export interface IConflictPatientSummary {
	_id: string;
	firstName?: string;
	lastName?: string;
}

export interface ISlotReplicationConflictMetadata {
	conflictingDate: string;
	conflictingPatientId?: string | null;
	conflictingStartTime: string;
	conflictingStatus?: string | null;
	dayId: string;
	originalPatientId?: string | null;
	recurrencePattern?: string | null;
	slotId: string;
}

export interface IPatientDuplicateConflictMetadata {
	candidatePatients: IConflictPatientSummary[];
	contacts: {
		email?: string;
		phone?: string;
	};
	incomingPatient?: {
		firstName?: string;
		lastName?: string;
	};
	match: 'multiple' | 'single';
}

export interface IConflict {
	_id: string;
	actionTaken?: string | null;
	createdAt: string;
	description: string;
	metadata: ISlotReplicationConflictMetadata | IPatientDuplicateConflictMetadata;
	resolvedAt?: string | null;
	status: ConflictStatus;
	therapistId: string;
	title: string;
	type: ConflictType;
	updatedAt: string;
}

export interface IGetConflictsResponse {
	conflicts: IConflict[];
}

export interface IGetConflictCountResponse {
	count: number;
}

export interface IUpdateConflictPayload {
	actionTaken?: string;
	conflictId: string;
	primaryPatientId?: string;
	secondaryPatientId?: string;
	status: Extract<ConflictStatus, 'DISMISSED' | 'RESOLVED'>;
	therapistId: string;
}

export interface IUpdateConflictResponse {
	conflict: IConflict;
}
