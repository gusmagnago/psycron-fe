import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { AddPatient } from '@psycron/components/icons/user/patient/AddPatient';
import { usePatient } from '@psycron/context/patient/PatientContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';

import { ContactsForm } from '../components/contacts/ContactsForm';
import { NameForm } from '../components/name/NameForm';

import {
	AddPatientFormActions,
	AddPatientFormElement,
	AddPatientFormFields,
} from './AddPatientForm.styles';
import type { AddPatientFormData, AddPatientProps } from './AddPatientForm.types';

export const AddPatientForm = ({
	buttonId,
	buttonTestId,
	shortButton,
}: AddPatientProps) => {
	const { t } = useTranslation();
	const { therapistId } = useUserDetails();
	const { createManualPatientMttn } = usePatient();

	const methods = useForm<AddPatientFormData>();
	const { handleSubmit, reset } = methods;

	const [open, setOpen] = useState<boolean>(false);

	const handleOpen = () => {
		capture(PostHogEvent.PatientCenterCreateOpened);
		setOpen(true);
	};

	const handleClose = () => {
		reset();
		setOpen(false);
	};

	const onSubmit = (data: AddPatientFormData) => {
		// At-least-one-contact is enforced by the ContactsForm `atLeastOneContact`
		// validation, so onSubmit only runs once email or phone is present.
		const { email, phone } = data.contacts ?? {};

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
					onClick={handleOpen}
					tertiary
					type='button'
				>
					<AddPatient />
				</Button>
			) : (
				<Button
					id={buttonId}
					data-testid={buttonTestId}
					onClick={handleOpen}
					endIcon={<AddPatient />}
					type='button'
				>
					{t('components.form.add-patient.name')}
				</Button>
			)}
			{open ? (
				<Drawer
					ariaLabel={t('components.form.add-patient.name')}
					closeButtonTestId='add-patient-drawer-close'
					contentTestId='add-patient-drawer-content'
					data-testid='add-patient-drawer'
					id='add-patient-drawer'
					onClose={handleClose}
					title={t('components.form.add-patient.name')}
				>
					<FormProvider {...methods}>
						<AddPatientFormElement
							data-testid='add-patient-form'
							id='add-patient-form'
							onSubmit={handleSubmit(onSubmit)}
						>
							<AddPatientFormFields
								data-testid='add-patient-form-fields'
								id='add-patient-form-fields'
							>
								<NameForm<AddPatientFormData>
									required
									testId='add-patient-form-name'
								/>
								<ContactsForm<AddPatientFormData>
									atLeastOneContact
									fullWidth
									testId='add-patient-form-contacts'
								/>
							</AddPatientFormFields>
							<AddPatientFormActions
								data-testid='add-patient-form-actions'
								id='add-patient-form-actions'
							>
								<Button
									data-testid='add-patient-drawer-submit'
									fullWidth
									id='add-patient-drawer-submit'
									type='submit'
								>
									{t('components.form.add-patient.name')}
								</Button>
							</AddPatientFormActions>
						</AddPatientFormElement>
					</FormProvider>
				</Drawer>
			) : null}
		</>
	);
};
