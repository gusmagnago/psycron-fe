import { useMemo } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { NameForm } from '@psycron/components/form/components/name/NameForm';
import { PreferredContactForm } from '@psycron/components/form/components/preferred-contact/PreferredContactForm';
import { TimezoneSelect } from '@psycron/components/form/components/timezone/TimezoneSelect';

import { FormWrapper } from '../../AvailabilityWeekDrawer.styles';
import { SlotLocationSection } from '../slot-location-section/SlotLocationSection';
import { SlotRecurrenceSection } from '../slot-recurrence-section/SlotRecurrenceSection';
import { SlotSessionDeliverySection } from '../slot-session-delivery/SlotSessionDeliverySection';

import type { ISlotAvailableBodyProps } from './SlotAvailableBody.types';

export const SlotAvailableBody = ({
	methods,
	sessionType,
	...locationProps
}: ISlotAvailableBodyProps) => {
	const { t } = useTranslation();
	const { control } = methods;

	const selectedPreferredType = useWatch({
		control,
		name: 'preferredContact.type',
	});
	const sessionDelivery = useWatch({ control, name: 'sessionDelivery' });

	// For non-BOTH types, derive delivery from sessionType
	const effectiveDelivery = useMemo(() => {
		if (sessionType === 'ONLINE') return 'online' as const;
		if (sessionType === 'IN_PERSON') return 'in_person' as const;
		return sessionDelivery; // BOTH: follows user card choice
	}, [sessionType, sessionDelivery]);

	const isOnline = effectiveDelivery === 'online';
	const isInPerson = effectiveDelivery === 'in_person';

	// Show contacts form for all delivery modes once a choice is made
	const showContactsForm = isInPerson || isOnline;

	// Require at least one contact for in-person or when platform = phone/whatsapp
	// Meet/Zoom contacts are optional extras
	const requireContacts =
		isInPerson ||
		selectedPreferredType === 'phone' ||
		selectedPreferredType === 'whatsapp';

	return (
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
					{sessionType === 'BOTH' && <SlotSessionDeliverySection />}

					{isOnline && <PreferredContactForm />}

					{showContactsForm && (
						<ContactsForm<ICreatePatientForm>
							atLeastOneContact={requireContacts}
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
					)}
					{isInPerson && <SlotLocationSection {...locationProps} />}
					<SlotRecurrenceSection />
					<TimezoneSelect />
				</FormWrapper>
			</Box>
		</FormProvider>
	);
};
