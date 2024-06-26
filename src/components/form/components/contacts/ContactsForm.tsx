import { useEffect, useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TextFieldProps } from '@mui/material';
import { Grid } from '@mui/material';
import { Switch } from '@psycron/components/switch/components/item/Switch';

import { PhoneInput } from '../phone/PhoneInput';
import { InputFields } from '../shared/styles';

import type { ContactsFormProps } from './ContactsForm.types';

export const ContactsForm = <T extends FieldValues>({
	errors,
	getPhoneValue,
	setPhoneValue,
	register,
	defaultValues,
	disabled
}: ContactsFormProps<T> & TextFieldProps) => {
	const { t } = useTranslation();

	const [hasWhatsApp, setHasWhatsApp] = useState<boolean>(false);
	const [isPhoneWpp, setIsPhoneWpp] = useState<boolean>(true);

	useEffect(() => {
		if (isPhoneWpp) {
			const phoneValue = getPhoneValue('phone' as Path<T>);
			setPhoneValue('whatsapp' as Path<T>, phoneValue);
		}
	}, [getPhoneValue, isPhoneWpp, setPhoneValue]);

	return (
		<Grid container>
			<Grid item xs={12}>
				<InputFields
					label={t('globals.email')}
					fullWidth
					id='email'
					defaultValue={defaultValues?.defaultEmail}
					{...register('email' as Path<T>)}
					autoComplete='email'
					error={!!errors?.email}
					helperText={errors?.email?.message as string}
					required
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12}>
				<PhoneInput
					errors={errors}
					register={register}
					registerName='phone'
					defaultValue={defaultValues?.defaultPhone}
					disabled={disabled}
				/>
			</Grid>
			<Grid container>
				<Grid item xs={12} display='flex'>
					<Switch
						onChange={() => setHasWhatsApp((prev) => !prev)}
						value={hasWhatsApp}
						label={t('components.form.contacts-form.contact-via', {method: 'Whatsapp'})}
						disabled={disabled}
					/>
				</Grid>
				{hasWhatsApp ? (
					<Grid item xs={12} display='flex'>
						<Switch
							onChange={() => setIsPhoneWpp((prev) => !prev)}
							value={isPhoneWpp}
							defaultChecked
							label={t('components.form.contacts-form.contact-via-same')}
						/>
					</Grid>
				) : null}

				{hasWhatsApp ? (
					<Grid item xs={12}>
						{!isPhoneWpp ? (
							<PhoneInput
								errors={errors}
								register={register}
								registerName='whatsapp'
								defaultValue={defaultValues?.defaultWpp}
							/>
						) : null}
					</Grid>
				) : null}
			</Grid>
		</Grid>
	);
};
