import { useEffect, useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TextFieldProps } from '@mui/material';
import { Grid } from '@mui/material';
import { Checkbox } from '@psycron/components/checkbox/Checkbox';

import { PhoneInput } from '../phone/PhoneInput';
import { InputFields } from '../shared/styles';

import type { ContactsFormProps } from './ContactsForm.types';

export const ContactsForm = <T extends FieldValues>({
	errors,
	getPhoneValue,
	setPhoneValue,
	register,
}: ContactsFormProps<T> & TextFieldProps) => {
	const { t } = useTranslation();

	const [hasWhatsApp, setHasWhatsApp] = useState<boolean>(false);
	const [isPhoneWpp, setIsPhoneWpp] = useState<boolean>(false);

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
					{...register('email' as Path<T>)}
					autoComplete='email'
					error={!!errors?.email}
					helperText={errors?.email?.message as string}
					required
				/>
			</Grid>
			<Grid item xs={12}>
				<PhoneInput errors={errors} register={register} registerName='phone' />
			</Grid>
			<Grid container>
				<Grid item>
					<Checkbox
						onChange={() => setHasWhatsApp((prev) => !prev)}
						value={hasWhatsApp}
						labelKey={'contact via WhatsApp?'}
					/>
				</Grid>
				{hasWhatsApp ? (
					<>
						<Grid item>
							<Checkbox
								onChange={() => setIsPhoneWpp((prev) => !prev)}
								value={isPhoneWpp}
								labelKey={'is phone number the same as whatsapp?'}
							/>
						</Grid>
						{!isPhoneWpp ? (
							<PhoneInput
								errors={errors}
								register={register}
								registerName='whatsapp'
							/>
						) : null}
					</>
				) : null}
			</Grid>
		</Grid>
	);
};
