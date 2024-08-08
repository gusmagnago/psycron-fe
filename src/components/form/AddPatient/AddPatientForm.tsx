import { useState } from 'react';
import { type FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Grid, IconButton } from '@mui/material';
import { AddPatient } from '@psycron/components/icons/user/patient/AddPatient';

import { ContactsForm } from '../components/contacts/ContactsForm';
import { NameForm } from '../components/name/NameForm';
import { FormWrapper } from '../FormWrapper/FormWrapper';

import type { AddPatientProps } from './AddPatientForm.types';

export const AddPatientForm = ({ shortButton }: AddPatientProps) => {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
	} = useForm();

	const [open, setOpen] = useState<boolean>(false);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onSubmit = (data: FieldValues) => {
		// eslint-disable-next-line no-console
		// console.log('🚀 ~ onSubmit ~ data:', data);
		// add correct http method
	};

	return (
		<>
			{shortButton ? (
				<IconButton onClick={() => setOpen(true)}>
					<AddPatient />
				</IconButton>
			) : (
				<Button
					onClick={() => setOpen(true)}
					endIcon={<AddPatient />}
					color='primary'
					variant='contained'
				>
					{t('components.form.add-patient.name')}
				</Button>
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
				<Grid container>
					<NameForm register={register} errors={errors} />
					<ContactsForm
						register={register}
						errors={errors}
						getPhoneValue={getValues}
						setPhoneValue={setValue}
					/>
				</Grid>
			</FormWrapper>
		</>
	);
};
