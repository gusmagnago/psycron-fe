export type ConsentPurpose =
	| 'data_processing'
	| 'marketing_communications'
	| 'third_party_sharing';

export type ConsentChannel =
	| 'web_booking'
	| 'therapist_booked'
	| 'self_management';

export interface ConsentRecord {
	channel: ConsentChannel;
	grantedAt: string;
	ipAddress: string;
	purpose: ConsentPurpose;
	revokedAt: string | null;
	version: string;
}

export interface RecordConsentPayload {
	channel: ConsentChannel;
	purpose: ConsentPurpose;
	version: string;
}

export interface ConsentRecordsResponse {
	consent: ConsentRecord[];
}

export interface DataDeletionResponse {
	deletionRequest: {
		_id: string;
		patientId: string;
		requestedAt: string;
		status: 'pending' | 'acknowledged' | 'completed';
		therapistId: string;
	};
	retentionNotice: string;
}
