import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { NameForm } from '@psycron/components/form/components/name/NameForm';

import { FormWrapper } from '../../AvailabilityWeekDrawer.styles';
import { SlotLocationSection } from '../slot-location-section/SlotLocationSection';

import type { ISlotAvailableBodyProps } from './SlotAvailableBody.types';

export const SlotAvailableBody = ({
	methods,
	showSessionLocation,
	...locationProps
}: ISlotAvailableBodyProps) => {
	const { t } = useTranslation();

	return (
		<>
			<FormProvider {...methods}>
				<Box component='form'>
					<FormWrapper>
						<NameForm<ICreatePatientForm>
							required
							fields={{ firstName: 'firstName', lastName: 'lastName' }}
							labelFirstName={t('availability.week.drawer.patient-first-name')}
							labelLastName={t('availability.week.drawer.patient-last-name')}
							placeholderFirstName={t(
								'availability.week.drawer.patient-first-name'
							)}
							placeholderLastName={t(
								'availability.week.drawer.patient-last-name'
							)}
						/>
						<ContactsForm<ICreatePatientForm>
							atLeastOneContact
							fullWidth
							fields={{
								email: 'email',
								hasWhatsApp: 'hasWhatsApp',
								isPhoneWpp: 'isPhoneWpp',
								phone: 'phone',
								whatsapp: 'whatsapp',
							}}
							labelEmail={t('availability.week.drawer.patient-email')}
							placeholderEmail={t('availability.week.drawer.patient-email')}
						/>
					</FormWrapper>
				</Box>
				{showSessionLocation && <SlotLocationSection {...locationProps} />}
			</FormProvider>
		</>
	);
};
