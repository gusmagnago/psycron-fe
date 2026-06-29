import apiClient from '../axios-instance';

// Mirrors psycron-be `practiceImport.types.ts`.

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

export interface PracticeImportPreview {
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

export interface PracticeImportCommitResult {
	created: number;
	rejected: number;
	sessionsLinked: number;
	skipped: number;
}

export const getPracticeImportPreview = async (
	therapistId: string
): Promise<PracticeImportPreview> => {
	const response = await apiClient.get<PracticeImportPreview>(
		`/users/${therapistId}/practice-import/preview`
	);
	return response.data;
};

export const commitPracticeImport = async (
	therapistId: string,
	decisions: ImportDecision[]
): Promise<PracticeImportCommitResult> => {
	const response = await apiClient.post<PracticeImportCommitResult>(
		`/users/${therapistId}/practice-import/commit`,
		{ decisions }
	);
	return response.data;
};
