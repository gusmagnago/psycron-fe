import { useTranslation } from 'react-i18next';
import { DashboardCard } from '@psycron/components/dashboard/components/dashboard-card/DashboardCard';
import { Appointment } from '@psycron/components/icons';

export const AppointmentsCard = () => {
	const { t } = useTranslation();

	const items = [
		{
			firstName: 'John',
			lastName: 'Doe',
			appointmentInfo: {
				appointments: 5,
				currency: 'USD',
				next: '2024-07-04T15:00:00',
				value: '200',
				duration: 60,
			},
			patientId: '23456543213456743211',
		},
		{
			firstName: 'Jane',
			lastName: 'Dona',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-04T16:00:00',
				value: '150',
				duration: 60,
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
		{
			firstName: 'Johan',
			lastName: 'Smthing',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-04T20:00:00',
				value: '150',
				duration: 60,
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
		{
			firstName: 'Jupi',
			lastName: 'Ferraz',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-04T21:00:00',
				value: '150',
				duration: 60,
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
		{
			firstName: 'Jupi',
			lastName: 'Ferraz',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-04T22:00:00',
				value: '150',
				duration: 60,
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
		{
			firstName: 'Jupi',
			lastName: 'Ferraz',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-04T23:00:00',
				value: '150',
				duration: 60,
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
		{
			firstName: 'Jupi',
			lastName: 'Ferraz',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-04T24:00:00',
				value: '150',
				duration: 60,
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
	];

	return (
		<DashboardCard
			icon={<Appointment />}
			iconTitleKey={t('components.appointments.manager')}
			// provide correct page url
			navigateToURL={'/'}
			// the items should come from a context provider
			items={items}
			titleKey={t('components.appointments.card-title')}
		/>
	);
};
