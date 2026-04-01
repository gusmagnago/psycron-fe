import { useMemo } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, TextField } from '@mui/material';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { PreferredContactForm } from '@psycron/components/form/components/preferred-contact/PreferredContactForm';
import { TimezoneSelect } from '@psycron/components/form/components/timezone/TimezoneSelect';

import { FormWrapper } from '../../AvailabilityWeekDrawer.styles';
import { PatientNameAutocomplete } from '../patient-name-autocomplete/PatientNameAutocomplete';
import { SlotLocationSection } from '../slot-location-section/SlotLocationSection';
import { SlotRecurrenceSection } from '../slot-recurrence-section/SlotRecurrenceSection';
import { SlotSessionDeliverySection } from '../slot-session-delivery/SlotSessionDeliverySection';

import type { ISlotAvailableBodyProps } from './SlotAvailableBody.types';

export const SlotAvailableBody = ({
	methods,
	onPatientSelect,
	onSelectionClear,
	results,
	searchIsLoading,
	searchQuery,
	selectedPatient,
	sessionType,
	setSearchQuery,
	...locationProps
}: ISlotAvailableBodyProps) => {
	const { t } = useTranslation();
	const { control, register, formState: { errors } } = methods;

	const selectedPreferredType = useWatch({
		control,
		name: 'preferredContact.type',
	});
	const sessionDelivery = useWatch({ control, name: 'sessionDelivery' });
	const lastNameValue = useWatch({ control, name: 'lastName' });

	// For non-BOTH types, derive delivery from sessionType
	const effectiveDelivery = useMemo(() => {
		if (sessionType === 'ONLINE') return 'online' as const;
		if (sessionType === 'IN_PERSON') return 'in_person' as const;
		return sessionDelivery; // BOTH: follows user card choice
	}, [sessionType, sessionDelivery]);

	const isOnline = effectiveDelivery === 'online';
	const isInPerson = effectiveDelivery === 'in_person';

	// Show contacts form once delivery is chosen, or immediately when a patient is selected
	const showContactsForm = isInPerson || isOnline || !!selectedPatient;

	// Require at least one contact for in-person or when platform = phone/whatsapp
	// Meet/Zoom contacts are optional extras
	const requireContacts =
		isInPerson ||
		selectedPreferredType === 'phone' ||
		selectedPreferredType === 'whatsapp';

	const lastNameError = errors.lastName;

	return (
		<FormProvider {...methods}>
			<Box component='form'>
				<FormWrapper>
					<PatientNameAutocomplete
						methods={methods}
						onPatientSelect={onPatientSelect}
						onSelectionClear={onSelectionClear}
						results={results}
						searchIsLoading={searchIsLoading}
						searchQuery={searchQuery}
						selectedPatient={selectedPatient}
						setSearchQuery={setSearchQuery}
					/>
					<TextField
						label={t('availability.week.drawer.patient-last-name')}
						fullWidth
						placeholder={t('availability.week.drawer.patient-last-name')}
						{...register('lastName', {
							required: t('components.form.validation.required', {
								name: t('availability.week.drawer.patient-last-name'),
							}),
						})}
						error={Boolean(lastNameError)}
						helperText={
							typeof lastNameError?.message === 'string'
								? lastNameError.message
								: undefined
						}
						InputLabelProps={{ shrink: !!lastNameValue }}
						required
					/>
					{sessionType === 'BOTH' && <SlotSessionDeliverySection />}

					{(isOnline || selectedPreferredType) && <PreferredContactForm />}

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
