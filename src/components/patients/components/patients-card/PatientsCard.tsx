import { useNavigate } from 'react-router-dom';
import { Box, Divider, Typography } from '@mui/material';
import { PatientManager } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

import { PatientCardItem } from '../patient-card-item/PatientCardItem';

import { PatientsCardTitle, PatientsCardWrapper } from './PatientsCard.styles';

export const PatientsCard = () => {
	const navigate = useNavigate();

	const patients = [
		{
			firstName: 'John',
			lastName: 'Doe',
			appointmentInfo: {
				appointments: 5,
				currency: 'USD',
				next: '2024-07-01T17:15:00',
				value: '200',
			},
			patientId: '23456543213456743211',
		},
		{
			firstName: 'Jane',
			lastName: 'Smith',
			appointmentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: '2024-07-01T18:20:00',
				value: '150',
			},
			patientId: '2345654321klbhjvgjhbnlm43211',
		},
	];

	return (
		<Box p={5}>
			<PatientsCardWrapper>
				<PatientsCardTitle>
					<Typography variant='h5' fontWeight={600}>
                        Patients
					</Typography>
					<Tooltip
						title='Patients Manager'
						onClick={() => navigate('/patients')}
					>
						<PatientManager />
					</Tooltip>
				</PatientsCardTitle>
				<Divider />
				<Box>
					{patients.map(
						(
							{ firstName, lastName, appointmentInfo, patientId },
							index,
						) => (
							<>
								<PatientCardItem
									key={index}
									appointmentInfo={appointmentInfo}
									firstName={firstName}
									lastName={lastName}
									patientId={patientId}
								/>
							</>
						),
					)}
				</Box>
			</PatientsCardWrapper>
		</Box>
	);
};
