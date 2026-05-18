import { Controller, FormProvider } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Checkbox, FormControlLabel, FormHelperText, Radio } from '@mui/material';
import { Divider } from '@psycron/components/divider/Divider';
import { AddressForm } from '@psycron/components/form/components/address/AddressForm';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { NameForm } from '@psycron/components/form/components/name/NameForm';
import { Text } from '@psycron/components/text/Text';
import { externalUrls } from '@psycron/pages/urls';

import type { IBookingFormValues } from '../BookAppointment.types';

import {
	ConsentBox,
	ConsentLabel,
	FormSection,
	NotifyBox,
	NotifyCheckboxWrapper,
	RecurrenceOption,
	SectionTitle,
} from './PublicBookingForm.styles';
import type { IPublicBookingFormProps } from './PublicBookingForm.types';

const RECURRENCE_OPTIONS = [
	{ label: 'booking.recurrence.single', value: 'SINGLE' },
	{ label: 'booking.recurrence.weekly', value: 'WEEKLY' },
	{ label: 'booking.recurrence.biweekly', value: 'BIWEEKLY' },
	{ label: 'booking.recurrence.monthly', value: 'MONTHLY' },
	{ label: 'booking.recurrence.not-yet', value: 'NOT_YET' },
] as const;

export const PublicBookingForm = ({
	letPatientChooseAddress,
	methods,
	therapistName,
}: IPublicBookingFormProps) => {
	const { i18n, t } = useTranslation();
	const {
		control,
		formState: { errors },
		watch,
	} = methods;
	const recurrence = watch('recurrencePattern');

	return (
		<FormProvider {...methods}>
			<FormSection>
				<NameForm<IBookingFormValues>
					required
					fields={{ firstName: 'firstName', lastName: 'lastName' }}
					labelFirstName={t('booking.form.first-name')}
					labelLastName={t('booking.form.last-name')}
					placeholderFirstName={t('booking.form.first-name')}
					placeholderLastName={t('booking.form.last-name')}
				/>

				<ContactsForm<IBookingFormValues>
					atLeastOneContact
					fullWidth
					fields={{
						email: 'email',
						hasWhatsApp: 'hasWhatsApp',
						isPhoneWpp: 'isPhoneWpp',
						phone: 'phone',
						whatsapp: 'whatsapp',
					}}
					labelEmail={t('booking.form.email')}
					placeholderEmail={t('booking.form.email')}
				/>

				{letPatientChooseAddress && (
					<>
						<Divider />
						<SectionTitle>{t('booking.form.your-address')}</SectionTitle>
						<AddressForm<IBookingFormValues>
							fields={{
								city: 'address.city',
								country: 'address.country',
								postcode: 'address.postcode',
								street: 'address.street',
							}}
							showGoogleAddressSearch
						/>
					</>
				)}

				<Divider />

				<SectionTitle>{t('booking.recurrence.title')}</SectionTitle>
				<Controller
					control={control}
					name='recurrencePattern'
					render={({ field }) => (
						<>
							{RECURRENCE_OPTIONS.map(({ label, value }) => (
								<RecurrenceOption
									isSelected={recurrence === value}
									key={value}
									onClick={() => field.onChange(value)}
								>
									<Radio
										checked={recurrence === value}
										onChange={() => field.onChange(value)}
										size='small'
										value={value}
									/>
									<Text variant='body2'>{t(label)}</Text>
								</RecurrenceOption>
							))}
						</>
					)}
				/>

				<Divider />

				<NotifyBox>
					<SectionTitle>{t('booking.notifications.title')}</SectionTitle>
					<Text color='text.secondary' mb={2} variant='body2'>
						{t('booking.notifications.description')}
					</Text>
					<NotifyCheckboxWrapper>
						<Controller
							control={control}
							name='notifyByEmail'
							render={({ field }) => (
								<FormControlLabel
									control={
										<Checkbox
											checked={field.value}
											onChange={(e) => field.onChange(e.target.checked)}
										/>
									}
									label={t('booking.notifications.email')}
								/>
							)}
						/>
						<Controller
							control={control}
							name='notifyByWhatsapp'
							render={({ field }) => (
								<FormControlLabel
									control={
										<Checkbox
											checked={field.value}
											onChange={(e) => field.onChange(e.target.checked)}
										/>
									}
									label={t('booking.notifications.whatsapp')}
								/>
							)}
						/>
					</NotifyCheckboxWrapper>
					<Text color='text.secondary' mt={1} variant='caption'>
						{t('booking.notifications.fallback-note')}
					</Text>
				</NotifyBox>

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
											values={{ therapistName }}
											components={{
												privacyLink: (
													<Link to={externalUrls(i18n.language).PRIVACY} />
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
			</FormSection>
		</FormProvider>
	);
};
