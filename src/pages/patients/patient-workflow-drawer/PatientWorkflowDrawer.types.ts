import type { PatientWorkspaceRow } from '../PatientsPage.types';

export interface PatientWorkflowDrawerProps {
	onClose: () => void;
	onCompleteNextAction: (patient: PatientWorkspaceRow) => void;
	onOpenProfile: (patientId: string) => void;
	patient: PatientWorkspaceRow;
}
