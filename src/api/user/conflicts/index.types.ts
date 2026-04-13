export type ConflictType = 'SLOT_REPLICATION' | 'PATIENT_DUPLICATE';
export type ConflictStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';
export type PatientMergeFieldSource = 'primary' | 'secondary';
export type PatientMergeField =
	| 'address'
	| 'contacts.email'
	| 'contacts.phone'
	| 'contacts.whatsapp'
	| 'firstName'
	| 'lastName'
	| 'preferredContact'
	| 'timeZone';

export type PatientMergeFieldSelections = Partial<
	Record<PatientMergeField, PatientMergeFieldSource>
>;

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

export interface IConflictResolutionDetails {
	fieldSelections?: PatientMergeFieldSelections;
	primaryPatientId?: string;
	secondaryPatientId?: string;
}

export interface IConflict {
	_id: string;
	actionTaken?: string | null;
	createdAt: string;
	description: string;
	metadata: ISlotReplicationConflictMetadata | IPatientDuplicateConflictMetadata;
	resolutionDetails?: IConflictResolutionDetails | null;
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
	fieldSelections?: PatientMergeFieldSelections;
	primaryPatientId?: string;
	secondaryPatientId?: string;
	status: Extract<ConflictStatus, 'DISMISSED' | 'RESOLVED'>;
	therapistId: string;
}

export interface IUpdateConflictResponse {
	conflict: IConflict;
}
