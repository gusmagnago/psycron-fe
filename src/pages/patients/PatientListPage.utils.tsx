import type {
	IPatientWorkspaceSummary,
	PatientWorkspaceQueueFilter,
} from '@psycron/api/patient/index.types';
import { Mail, Phone } from '@psycron/components/icons';

export const getPatientWorkspaceQueueCount = (
	summary: IPatientWorkspaceSummary,
	queue: PatientWorkspaceQueueFilter
): number => {
	switch (queue) {
		case 'billing':
			return summary.billing;
		case 'contact':
			return summary.missingContact;
		case 'duplicate':
			return summary.duplicate;
		case 'needs-attention':
			return summary.needsAttention;
		case 'recovery':
			return summary.recovery;
	}
};

export const getPreferredContactIcon = (type: string | undefined) => {
	switch (type) {
		case 'phone':
		case 'whatsapp':
			return <Phone />;
		default:
			return <Mail />;
	}
};
