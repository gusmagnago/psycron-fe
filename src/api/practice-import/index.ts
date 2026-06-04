import apiClient from '../axios-instance';

export type ImportConfidence = 'high' | 'medium' | 'low';

export interface ImportCandidatePatient {
	confidence: ImportConfidence;
	confidenceScore: number;
	contact: { email?: string; phone?: string } | null;
	firstName: string;
	lastName: string;
	modality: 'online' | 'in-person' | null;
	needsReview: boolean;
	recurrence: { startTime: string, weekday: number; } | null;
	sessionCount: number;
	sourceEventIds: string[];
}

export interface ImportPreview {
	candidates: ImportCandidatePatient[];
	summary: {
		needsReview: number;
		patientsFound: number;
		sessionsFound: number;
		sourceEvents: number;
	};
}

export interface ImportDecision {
	action: 'accept' | 'reject';
	edited?: {
		contact?: { email?: string; phone?: string } | null;
		firstName?: string;
		lastName?: string;
	};
	proposal: ImportCandidatePatient;
}

export interface CommitResult {
	created: number;
	rejected: number;
	skipped: number;
}

export const getPracticeImportPreview = async (
	therapistId: string
): Promise<ImportPreview> => {
	const response = await apiClient.get<ImportPreview>(
		`/users/${therapistId}/practice-import/preview`
	);
	return response.data;
};

export const commitPracticeImport = async (
	therapistId: string,
	decisions: ImportDecision[]
): Promise<CommitResult> => {
	const response = await apiClient.post<CommitResult>(
		`/users/${therapistId}/practice-import/commit`,
		{ decisions }
	);
	return response.data;
};
