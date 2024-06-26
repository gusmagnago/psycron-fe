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
			appointNamentInfo: {
				appointments: 5,
				currency: 'USD',
				next: 'June 27, 2024 17:45pm',
				value: '200',
			},
			patientId: '23456543213456743211',
		},
		{
			firstName: 'Jane',
			lastName: 'Smith',
			appointNamentInfo: {
				appointments: 3,
				currency: 'EUR',
				next: 'July 14, 2024 17:45pm',
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
						({ firstName, lastName, appointNamentInfo, patientId }, index) => (
							<>
								<PatientCardItem
									key={index}
									appointNamentInfo={appointNamentInfo}
									firstName={firstName}
									lastName={lastName}
									patientId={patientId}
								/>
							</>
						)
					)}
				</Box>
			</PatientsCardWrapper>
		</Box>
	);
};
