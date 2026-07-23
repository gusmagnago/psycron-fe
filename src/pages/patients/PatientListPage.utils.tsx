import type {
	IPatientWorkspaceSummary,
	PatientWorkspaceQueueFilter,
} from '@psycron/api/patient/index.types';
import { Google, Mail, Phone, WhatsApp } from '@psycron/components/icons';

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
			return <Phone />;
		case 'whatsapp':
			return <WhatsApp />;
		case 'google_meet':
			return <Google />;
		case 'zoom':
			return <Mail />;
		default:
			return <Mail />;
	}
};
