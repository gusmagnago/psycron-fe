export interface AddPatientProps {
	shortButton: boolean;
}

export interface AddPatientFormData {
	contacts: {
		email?: string;
		phone?: string;
		whatsapp?: string;
	};
	firstName: string;
	hasWhatsApp?: boolean;
	isPhoneWpp?: boolean;
	lastName: string;
}
