export interface LatestPatient {
	createdAt: string;
	firstName: string;
	id: string;
	lastName: string;
}

export interface ActivePatientsWidgetProps {
	isLoading?: boolean;
	onPatientClick: (patientId: string) => void;
	patients: LatestPatient[];
}
