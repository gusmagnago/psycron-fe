import { useEffect, useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TextFieldProps } from '@mui/material';
import { Box, TextField } from '@mui/material';
import { Switch } from '@psycron/components/switch/components/item/Switch';

import { PhoneInput } from '../phone/PhoneInput';

import type { ContactsFormProps } from './ContactsForm.types';

export const ContactsForm = <T extends FieldValues>({
	errors,
	getPhoneValue,
	setPhoneValue,
	register,
	defaultValues,
	disabled,
}: ContactsFormProps<T> & TextFieldProps) => {
	const { t } = useTranslation();

	const { email, phone, whatsapp } = defaultValues;

	const [hasWhatsApp, setHasWhatsApp] = useState<boolean>(false);
	const [isPhoneWpp, setIsPhoneWpp] = useState<boolean>(true);

	useEffect(() => {
		if (isPhoneWpp) {
			const phoneValue = getPhoneValue('phone' as Path<T>);
			setPhoneValue('whatsapp' as Path<T>, phoneValue);
		}
	}, [getPhoneValue, isPhoneWpp, setPhoneValue]);

	return (
		<Box>
			<Box pb={4}>
				<TextField
					label={t('globals.email')}
					fullWidth
					id='email'
					defaultValue={email}
					{...register('email' as Path<T>)}
					autoComplete='email'
					error={!!errors?.email}
					helperText={errors?.email?.message as string}
					required
					disabled={disabled}
				/>
			</Box>
			<Box>
				<PhoneInput
					errors={errors}
					register={register}
					registerName='phone'
					defaultValue={phone}
					disabled={disabled}
				/>
			</Box>
			<Box>
				<Box display='flex'>
					<Switch
						onChange={() => setHasWhatsApp((prev) => !prev)}
						value={hasWhatsApp}
						label={t('components.form.contacts-form.contact-via', {
							method: 'Whatsapp',
						})}
						disabled={disabled}
					/>
				</Box>
				{hasWhatsApp ? (
					<Box display='flex'>
						<Switch
							onChange={() => setIsPhoneWpp((prev) => !prev)}
							value={isPhoneWpp}
							defaultChecked
							label={t('components.form.contacts-form.contact-via-same')}
						/>
					</Box>
				) : null}

				{hasWhatsApp ? (
					<Box>
						{!isPhoneWpp ? (
							<PhoneInput
								errors={errors}
								register={register}
								registerName='whatsapp'
								defaultValue={whatsapp}
							/>
						) : null}
					</Box>
				) : null}
			</Box>
		</Box>
	);
};
