import { useMemo } from 'react';
import { Controller, FormProvider, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
	Box,
	Checkbox,
	FormControlLabel,
	FormHelperText,
	TextField,
} from '@mui/material';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import { ShareButton } from '@psycron/components/button/share/ShareButton';
import { Divider } from '@psycron/components/divider/Divider';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { PreferredContactForm } from '@psycron/components/form/components/preferred-contact/PreferredContactForm';
import { TimezoneSelect } from '@psycron/components/form/components/timezone/TimezoneSelect';
import {
	Account,
	Appointment,
	Phone,
	Send,
} from '@psycron/components/icons';
import { externalUrls } from '@psycron/pages/urls';

import { FormWrapper } from '../../AvailabilityWeekDrawer.styles';
import { PatientNameAutocomplete } from '../patient-name-autocomplete/PatientNameAutocomplete';
import { SlotLocationSection } from '../slot-location-section/SlotLocationSection';
import { SlotRecurrenceSection } from '../slot-recurrence-section/SlotRecurrenceSection';
import { SlotSessionDeliverySection } from '../slot-session-delivery/SlotSessionDeliverySection';
import { SlotSessionSection } from '../slot-session-section/SlotSessionSection';

import { AvailableSection } from './available-section/AvailableSection';
import {
	BookingLinkHeader,
	BookingLinkHint,
	BookingLinkLabel,
	BookingLinkSection,
	BookingLinkValue,
	BookingLinkValueRow,
	ConsentBox,
	ConsentLabel,
	ReopenedNote,
	ReopenedNoteLabel,
	ReopenedNoteText,
} from './SlotAvailableBody.styles';
import type { ISlotAvailableBodyProps } from './SlotAvailableBody.types';

export const SlotAvailableBody = ({
	bookingLink,
	methods,
	onPatientSelect,
	onSelectionClear,
	reopenedCancellationNote,
	results,
	searchIsLoading,
	searchQuery,
	selectedPatient,
	sessionDetails,
	sessionType,
	setSearchQuery,
	shareText,
	shareTitle,
	...locationProps
}: ISlotAvailableBodyProps) => {
	const { i18n, t } = useTranslation();
	const {
		control,
		register,
		formState: { errors },
	} = methods;

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
					<AvailableSection
						icon={<Appointment />}
						title={t('availability.week.drawer.section.session')}
					>
						<SlotSessionSection {...sessionDetails} />
						{reopenedCancellationNote && (
							<ReopenedNote>
								<ReopenedNoteLabel>
									{t('availability.week.drawer.reopened-note-label')}
								</ReopenedNoteLabel>
								<ReopenedNoteText>{reopenedCancellationNote}</ReopenedNoteText>
							</ReopenedNote>
						)}
					</AvailableSection>

					<Divider />

					<AvailableSection
						icon={<Send />}
						title={t('availability.week.drawer.section.booking-link')}
					>
						<BookingLinkSection>
							<BookingLinkHeader>
								<BookingLinkLabel>
									{t('availability.week.drawer.booking-link-label')}
								</BookingLinkLabel>
								<ShareButton
									absoluteUrl={bookingLink}
									preferNativeShare
									textKey={shareText}
									titleKey={shareTitle}
								/>
							</BookingLinkHeader>
							<BookingLinkValueRow>
								<BookingLinkValue>{bookingLink}</BookingLinkValue>
							</BookingLinkValueRow>
							<BookingLinkHint>
								{t('availability.week.drawer.booking-link-hint')}
							</BookingLinkHint>
						</BookingLinkSection>
					</AvailableSection>

					<Divider />

					<AvailableSection
						icon={<Account />}
						title={t('availability.week.drawer.section.patient')}
					>
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
							slotProps={{ inputLabel: { shrink: !!lastNameValue } }}
							required
						/>
					</AvailableSection>

					<Divider />

					<AvailableSection
						icon={<Phone />}
						title={t('availability.week.drawer.section.contact-delivery')}
					>
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
					</AvailableSection>

					<Divider />

					<SlotRecurrenceSection />
					<TimezoneSelect />

					{!selectedPatient ? (
						<ConsentBox>
							<Controller
								control={control}
								name='consentAccepted'
								rules={{ validate: (value) => value || t('consent.required') }}
								render={({ field }) => (
									<FormControlLabel
										control={
											<Checkbox
												checked={Boolean(field.value)}
												onChange={(e) => field.onChange(e.target.checked)}
											/>
										}
										label={
											<ConsentLabel>
												<Trans
													i18nKey='consent.dataProcessing'
													values={{
														therapistName: t('consent.yourTherapist'),
													}}
													components={{
														privacyLink: (
															<Link
																to={externalUrls(i18n.language).PRIVACY}
															/>
														),
													}}
												/>
											</ConsentLabel>
										}
									/>
								)}
							/>
							{errors.consentAccepted?.message ? (
								<FormHelperText error>
									{String(errors.consentAccepted.message)}
								</FormHelperText>
							) : null}
						</ConsentBox>
					) : null}
				</FormWrapper>
			</Box>
		</FormProvider>
	);
};
