import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { usePatient } from '@psycron/context/patient/PatientContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { PATIENTS } from '@psycron/pages/urls';

export const PatientProfilePage = () => {
	const { t } = useTranslation();
	const { patientId } = useParams<{ patientId: string }>();
	const therapistId = useTherapistId();
	const { isPatientDetailsLoading, patientDetails } = usePatient(
		therapistId,
		patientId ?? null
	);

	const title = patientDetails
		? [patientDetails.firstName, patientDetails.lastName].filter(Boolean).join(' ')
		: t('globals.patient');

	return (
		<PageLayout
			title={title}
			subTitle={t('patients.profile-placeholder')}
			isLoading={isPatientDetailsLoading}
			backButton
			backTo={PATIENTS}
		>
			<div />
		</PageLayout>
	);
};
