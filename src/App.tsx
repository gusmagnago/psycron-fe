import { PatientCardItem } from '@psycron/components/patients/components/patient-card-item/PatientCardItem';
import { PatientsCard } from '@psycron/components/patients/components/patients-card/PatientsCard';

function App() {
	return (
		<>
			<PatientCardItem
				appointNamentInfo={{
					appointments:99,
					next: 'Seg 17/06 Jan 18:30',
					value: '50',
					currency: '€'
				}}
				firstName={'Johan'}
				lastName={'Donna'}
			/>

			<PatientsCard />
		</>
	);
}

export default App;
