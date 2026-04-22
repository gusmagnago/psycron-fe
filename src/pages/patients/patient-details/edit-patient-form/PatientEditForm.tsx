import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import type { CustomError } from '@psycron/api/error';
import { updatePatientDetailsById } from '@psycron/api/patient';
import { CloseButton } from '@psycron/components/button/close/CloseButton';
import { AddressForm } from '@psycron/components/form/components/address/AddressForm';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { NameForm } from '@psycron/components/form/components/name/NameForm';
import { PreferredContactForm } from '@psycron/components/form/components/preferred-contact/PreferredContactForm';
import { TimezoneSelect } from '@psycron/components/form/components/timezone/TimezoneSelect';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
	BillingChoiceButton,
	BillingChoiceDescription,
	BillingChoiceRow,
	BillingFieldGroup,
	BillingGrid,
	EditPatientActions,
	EditPatientBody,
	EditPatientDescription,
	EditPatientFormRoot,
	EditPatientHeader,
	EditPatientModal,
	EditPatientSecondaryButton,
	EditPatientSection,
	EditPatientSectionTitle,
	EditPatientSubmitButton,
	EditPatientTitle,
	EditPatientTitleGroup,
} from './PatientEditForm.styles';
import type {
	PatientEditFormProps,
	PatientEditFormValues,
} from './PatientEditForm.types';
import {
	mapPatientEditFormToPayload,
	mapPatientToEditFormValues,
} from './PatientEditForm.utils';

export const PatientEditForm = ({
	onClose,
	open,
	patient,
	therapistId,
}: PatientEditFormProps) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const methods = useForm<PatientEditFormValues>({
		defaultValues: mapPatientToEditFormValues(patient),
	});
	const billingModel = methods.watch('billing.model');
	const billingCategory = methods.watch('billing.category');
	const billingAmountName =
		billingModel === 'monthly'
			? 'billing.monthlyPrice.amount'
			: 'billing.sessionPrice.amount';
	const billingCurrencyName =
		billingModel === 'monthly'
			? 'billing.monthlyPrice.currency'
			: 'billing.sessionPrice.currency';
	const selectedBillingCategoryDescription = billingCategory
		? t(`patients.profile.billing.category-descriptions.${billingCategory}`)
		: '';

	useEffect(() => {
		if (open) {
			methods.reset(mapPatientToEditFormValues(patient));
		}
	}, [methods, open, patient]);

	const updatePatientMutation = useMutation({
		mutationFn: updatePatientDetailsById,
		onError: (error: CustomError) => {
			showAlert({
				message: error.message,
				severity: 'error',
			});
		},
		onSuccess: (data) => {
			queryClient.setQueryData(['patientDetails', patient._id], data.patient);
			queryClient.setQueryData(
				['patientListItem', therapistId, patient._id],
				data.patient
			);
			queryClient.invalidateQueries({
				queryKey: ['patientListItem', therapistId, patient._id],
			});
			queryClient.invalidateQueries({
				queryKey: ['patientDetails', patient._id],
			});
			showAlert({
				message: data.message,
				severity: 'success',
			});
			onClose();
		},
	});

	const handleSubmit = (values: PatientEditFormValues): void => {
		updatePatientMutation.mutate({
			patient: mapPatientEditFormToPayload(values),
			patientId: patient._id,
		});
	};

	return (
		<FormProvider {...methods}>
			<EditPatientModal
				aria-describedby='patient-edit-description'
				aria-labelledby='patient-edit-title'
				open={open}
				onClose={onClose}
			>
				<EditPatientFormRoot
					noValidate
					onSubmit={methods.handleSubmit(handleSubmit)}
				>
					<EditPatientHeader>
						<EditPatientTitleGroup>
							<EditPatientTitle id='patient-edit-title'>
								{t('patients.profile.edit.title')}
							</EditPatientTitle>
							<EditPatientDescription id='patient-edit-description'>
								{t('patients.profile.edit.description')}
							</EditPatientDescription>
						</EditPatientTitleGroup>
						<CloseButton
							disabled={updatePatientMutation.isPending}
							onClick={onClose}
						/>
					</EditPatientHeader>

					<EditPatientBody>
						<EditPatientSection>
							<EditPatientSectionTitle>{t('globals.name')}</EditPatientSectionTitle>
							<NameForm<PatientEditFormValues> required />
						</EditPatientSection>

						<EditPatientSection>
							<EditPatientSectionTitle>
								{t('components.user-details.section.title.contact')}
							</EditPatientSectionTitle>
							<ContactsForm<PatientEditFormValues>
								atLeastOneContact
								fields={{
									email: 'email',
									hasWhatsApp: 'hasWhatsApp',
									isPhoneWpp: 'isPhoneWpp',
									phone: 'phone',
									whatsapp: 'whatsapp',
								}}
								fullWidth
							/>
							<PreferredContactForm />
						</EditPatientSection>

						<EditPatientSection>
							<EditPatientSectionTitle>
								{t('patients.list.columns.timezone')}
							</EditPatientSectionTitle>
							<TimezoneSelect />
						</EditPatientSection>

						<EditPatientSection>
							<EditPatientSectionTitle>{t('globals.address')}</EditPatientSectionTitle>
							<AddressForm<PatientEditFormValues>
								fields={{
									city: 'address.city',
									country: 'address.country',
									postcode: 'address.postcode',
									street: 'address.street',
								}}
								showGoogleAddressSearch
							/>
						</EditPatientSection>

						<EditPatientSection>
							<EditPatientSectionTitle>
								{t('patients.profile.sections.billing')}
							</EditPatientSectionTitle>
							<BillingGrid>
								<BillingFieldGroup>
									<EditPatientSectionTitle>
										{t('patients.profile.billing.model')}
									</EditPatientSectionTitle>
									<BillingChoiceRow
										aria-label={t('patients.profile.billing.model')}
										role='radiogroup'
									>
										<BillingChoiceButton
											aria-checked={billingModel === 'per_session'}
											isSelected={billingModel === 'per_session'}
											onClick={() =>
												methods.setValue('billing.model', 'per_session', {
													shouldDirty: true,
												})
											}
											role='radio'
											type='button'
										>
											{t('patients.profile.billing.models.per-session')}
										</BillingChoiceButton>
										<BillingChoiceButton
											aria-checked={billingModel === 'monthly'}
											isSelected={billingModel === 'monthly'}
											onClick={() =>
												methods.setValue('billing.model', 'monthly', {
													shouldDirty: true,
												})
											}
											role='radio'
											type='button'
										>
											{t('patients.profile.billing.models.monthly')}
										</BillingChoiceButton>
									</BillingChoiceRow>
								</BillingFieldGroup>
								<BillingFieldGroup>
									<EditPatientSectionTitle>
										{t('patients.profile.billing.category')}
									</EditPatientSectionTitle>
									<BillingChoiceRow
										aria-label={t('patients.profile.billing.category')}
										role='radiogroup'
									>
										<BillingChoiceButton
											aria-checked={billingCategory === 'standard'}
											isSelected={billingCategory === 'standard'}
											onClick={() =>
												methods.setValue('billing.category', 'standard', {
													shouldDirty: true,
												})
											}
											role='radio'
											type='button'
										>
											{t('patients.profile.billing.categories.standard')}
										</BillingChoiceButton>
										<BillingChoiceButton
											aria-checked={billingCategory === 'social'}
											isSelected={billingCategory === 'social'}
											onClick={() =>
												methods.setValue('billing.category', 'social', {
													shouldDirty: true,
												})
											}
											role='radio'
											type='button'
										>
											{t('patients.profile.billing.categories.social')}
										</BillingChoiceButton>
										<BillingChoiceButton
											aria-checked={billingCategory === 'pro_bono'}
											isSelected={billingCategory === 'pro_bono'}
											onClick={() =>
												methods.setValue('billing.category', 'pro_bono', {
													shouldDirty: true,
												})
											}
											role='radio'
											type='button'
										>
											{t('patients.profile.billing.categories.pro-bono')}
										</BillingChoiceButton>
									</BillingChoiceRow>
									{selectedBillingCategoryDescription ? (
										<BillingChoiceDescription>
											{selectedBillingCategoryDescription}
										</BillingChoiceDescription>
									) : null}
								</BillingFieldGroup>
								<Controller
									control={methods.control}
									name={billingAmountName}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											inputProps={{ min: 0, step: '0.01' }}
											label={t('patients.profile.billing.amount')}
											onChange={(event) => {
												const { value } = event.target;
												field.onChange(value === '' ? '' : Number(value));
											}}
											type='number'
											value={field.value ?? ''}
										/>
									)}
								/>
								<Controller
									control={methods.control}
									name={billingCurrencyName}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											label={t('patients.profile.billing.currency')}
											placeholder='EUR'
											value={field.value ?? ''}
										/>
									)}
								/>
							</BillingGrid>
						</EditPatientSection>

						<EditPatientActions>
							<EditPatientSecondaryButton
								disabled={updatePatientMutation.isPending}
								onClick={onClose}
								type='button'
								variant='outlined'
							>
								{t('common.cancel')}
							</EditPatientSecondaryButton>
							<EditPatientSubmitButton
								loading={updatePatientMutation.isPending}
								type='submit'
							>
								{t('patients.profile.edit.save')}
							</EditPatientSubmitButton>
						</EditPatientActions>
					</EditPatientBody>
				</EditPatientFormRoot>
			</EditPatientModal>
		</FormProvider>
	);
};
