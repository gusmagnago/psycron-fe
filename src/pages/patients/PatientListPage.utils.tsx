import { Google, Mail, Phone, WhatsApp } from '@psycron/components/icons';

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
