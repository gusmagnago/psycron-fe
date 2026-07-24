import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button as MuiButton, Grid } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { AddPatient } from '@psycron/components/icons/user/patient/AddPatient';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { usePatient } from '@psycron/context/patient/PatientContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';

import { ContactsForm } from '../components/contacts/ContactsForm';
import { NameForm } from '../components/name/NameForm';
import { FormWrapper } from '../FormWrapper/FormWrapper';

import type { AddPatientFormData, AddPatientProps } from './AddPatientForm.types';

export const AddPatientForm = ({
	buttonId,
	buttonTestId,
	shortButton,
}: AddPatientProps) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const { therapistId } = useUserDetails();
	const { createManualPatientMttn } = usePatient();

	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		reset,
		formState: { errors },
	} = useForm<AddPatientFormData>();

	const [open, setOpen] = useState<boolean>(false);

	const onSubmit = (data: AddPatientFormData) => {
		const { email, phone } = data.contacts ?? {};

		if (!email && !phone) {
			showAlert({
				message: t('components.form.add-patient.contacts-required'),
				severity: 'error',
			});
			return;
		}

		createManualPatientMttn({
			therapistId,
			patient: {
				firstName: data.firstName,
				lastName: data.lastName,
				contacts: {
					...(email && { email }),
					...(phone && { phone }),
					...(data.contacts?.whatsapp && { whatsapp: data.contacts.whatsapp }),
				},
			},
		});
		reset();
		setOpen(false);
	};

	return (
		<>
			{shortButton ? (
				<Button
					aria-label={t('components.form.add-patient.name')}
					id={buttonId}
					data-testid={buttonTestId}
					onClick={() => setOpen(true)}
					tertiary
					type='button'
				>
					<AddPatient />
				</Button>
			) : (
				<MuiButton
					id={buttonId}
					data-testid={buttonTestId}
					onClick={() => setOpen(true)}
					endIcon={<AddPatient />}
					color='primary'
					variant='contained'
				>
					{t('components.form.add-patient.name')}
				</MuiButton>
			)}
			<FormWrapper
				formDescription='add-patient-inputs'
				formTitle='add-patient'
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				submitButtonLabel={t('components.form.add-patient.name')}
				open={open}
				onClose={() => setOpen(false)}
			>
				<Grid container size={12}>
					<NameForm register={register} errors={errors} required />
					<ContactsForm
						register={register}
						errors={errors}
						getPhoneValue={getValues}
						setPhoneValue={setValue}
						setValue={setValue}
						required
					/>
				</Grid>
			</FormWrapper>
		</>
	);
};
