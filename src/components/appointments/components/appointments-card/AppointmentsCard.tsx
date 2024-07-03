import { DashboardCard } from '@psycron/components/dashboard/components/dashboard-card/DashboardCard';
import { Appointment } from '@psycron/components/icons';

export const AppointmentsCard = () => {
	const items = [
		{
			firstName: 'John',
			lastName: 'Doe',
			appointmentInfo: {
				appointments: 5,
				currency: 'USD',
				next: '2024-07-03T15:00:00',
				value: '200',
				duration: 60
			},
			patientId: '23456543213456743211',
		},
		{
			firstName: 'Jane',
			lastName: 'Dona',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-03T16:00:00',
				value: '150',
				duration: 60
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
		{
			firstName: 'Johan',
			lastName: 'Smthing',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-03T17:00:00',
				value: '150',
				duration: 60
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
		{
			firstName: 'Jupi',
			lastName: 'Ferraz',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-05T18:00:00',
				value: '150',
				duration: 60
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
	];


	return (
		<DashboardCard
			icon={<Appointment />}
			iconTitleKey={'Appointments manager'}
			navigateToURL={'/'}
			// the items should come from a context provider
			items={items}
			titleKey={'Appointments'}
		/>
	);
};
