import type { FieldValues, Path } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { Switch } from '@psycron/components/switch/components/item/Switch';
import useViewport from '@psycron/hooks/useViewport';

import { PhoneInputComponent } from '../phone/PhoneInput';

import {
	ContactsFormSwitchWrapper,
	ContactsFormWhatsAppWrapper,
	ContactsFormWrapper,
	EmailPhoneWrapper,
	InputWrapper,
} from './ContactsForm.styles';
import type { ContactsFormProps } from './ContactsForm.types';

export const ContactsForm = <T extends FieldValues>({
	atLeastOneContact = false,
	defaultValues,
	disabled,
	fields,
	fullWidth,
	hidePhone = false,
	labelEmail,
	placeholderEmail,
	required = false,
	...textFieldProps
}: ContactsFormProps<T>) => {
	const { t } = useTranslation();
	const { isSmallerThanTablet } = useViewport();

	const { register, getFieldState, control, getValues, setValue } =
		useFormContext<T>();

	const emailPath = (fields?.email ?? ('contacts.email' as Path<T>)) as Path<T>;
	const phonePath = (fields?.phone ?? ('contacts.phone' as Path<T>)) as Path<T>;
	const whatsappPath = (fields?.whatsapp ??
		('contacts.whatsapp' as Path<T>)) as Path<T>;

	const hasWhatsAppPath = (fields?.hasWhatsApp ??
		('contacts.hasWhatsApp' as Path<T>)) as Path<T>;
	const isPhoneWppPath = (fields?.isPhoneWpp ??
		('contacts.isPhoneWpp' as Path<T>)) as Path<T>;

	const hasWhatsApp = Boolean(useWatch({ control, name: hasWhatsAppPath }));
	const isPhoneWpp = Boolean(useWatch({ control, name: isPhoneWppPath }));
	const emailValue = useWatch({ control, name: emailPath });

	const emailState = getFieldState(emailPath);
	const emailError =
		typeof emailState.error?.message === 'string'
			? emailState.error.message
			: undefined;

	return (
		<ContactsFormWrapper>
			<EmailPhoneWrapper>
				<TextField
					{...textFieldProps}
					label={labelEmail ?? t('globals.email')}
					fullWidth
					id={String(emailPath)}
					defaultValue={defaultValues?.email ?? ''}
					placeholder={
						!defaultValues?.email
							? (placeholderEmail ?? t('components.input.text.email'))
							: undefined
					}
					{...register(emailPath, {
						validate: atLeastOneContact
							? (v) => {
									const phone = getValues(phonePath) as string | undefined;
									if (!v?.trim() && !phone?.trim()) {
										return t('components.form.validation.at-least-one-contact');
									}
									return true;
								}
							: undefined,
					})}
					autoComplete='email'
					error={Boolean(emailState.error)}
					helperText={emailError}
					required={required}
					disabled={disabled}
					slotProps={{
						inputLabel: { shrink: !!emailValue },
						htmlInput: { 'data-testid': 'contacts-form-email' },
					}}
				/>

			{!hidePhone && (
					<InputWrapper>
						<PhoneInputComponent<T>
							name={phonePath}
							required={atLeastOneContact ? false : required}
							validateFn={
								atLeastOneContact
									? (v) => {
											const email = getValues(emailPath) as string | undefined;
											if (!v?.trim() && !email?.trim()) {
												return t(
													'components.form.validation.at-least-one-contact'
												);
											}
											return true;
										}
									: undefined
							}
							disabled={disabled}
							defaultValue={defaultValues?.phone ?? ''}
							labelKey='globals.phone'
							testId='contacts-form-phone'
						/>
					</InputWrapper>
				)}
			</EmailPhoneWrapper>
			{!hidePhone && (
				<ContactsFormSwitchWrapper>
					<Switch
						small={isSmallerThanTablet}
						checked={hasWhatsApp}
						onChange={(_, next) => {
							if (disabled) return;

							setValue(hasWhatsAppPath, next as never, {
								shouldDirty: true,
								shouldTouch: true,
							});

							if (!next) {
								setValue(isPhoneWppPath, false as never, {
									shouldDirty: true,
									shouldTouch: true,
								});
								setValue(whatsappPath, '' as never, {
									shouldDirty: true,
									shouldTouch: true,
								});
							}
						}}
						label={t('components.form.contacts-form.contact-via', {
							method: 'Whatsapp',
						})}
						disabled={disabled}
					/>

					{hasWhatsApp ? (
						<Switch
							small={isSmallerThanTablet}
							checked={isPhoneWpp}
							onChange={(_, next) => {
								if (disabled) return;

								setValue(isPhoneWppPath, next as never, {
									shouldDirty: true,
									shouldTouch: true,
								});

								if (next) {
									setValue(whatsappPath, '' as never, {
										shouldDirty: true,
										shouldTouch: true,
									});
								}
							}}
							label={t('components.form.contacts-form.contact-via-same')}
							disabled={disabled}
						/>
					) : null}
				</ContactsFormSwitchWrapper>
			)}

			<input type='hidden' {...register(hasWhatsAppPath)} />
			<input type='hidden' {...register(isPhoneWppPath)} />

			{!hidePhone && hasWhatsApp && !isPhoneWpp ? (
				<ContactsFormWhatsAppWrapper isFullWidth={fullWidth}>
					<InputWrapper>
						<PhoneInputComponent<T>
							name={whatsappPath}
							required={hasWhatsApp && !isPhoneWpp}
							disabled={disabled}
							defaultValue={defaultValues?.whatsapp ?? ''}
							labelKey='globals.whatsapp'
						/>
					</InputWrapper>
				</ContactsFormWhatsAppWrapper>
			) : null}
		</ContactsFormWrapper>
	);
};
