import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormControl, NativeSelect, OutlinedInput } from '@mui/material';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import type { PreferredContactType } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import {
	PreferredContactFields,
	PreferredContactTypeSelect,
	PreferredContactUrlInputLabel,
	PreferredContactWrapper,
} from './PreferredContactForm.styles';
import type { PreferredContactFormProps } from './PreferredContactForm.types';

const PREFERRED_CONTACT_TYPES: PreferredContactType[] = [
	'whatsapp',
	'phone',
	'google_meet',
	'zoom',
];

const isUrlType = (type: PreferredContactType): boolean =>
	type === 'google_meet' || type === 'zoom';

export const PreferredContactForm = ({
	disabled,
}: PreferredContactFormProps) => {
	const { t } = useTranslation();
	const { register, control, setValue } = useFormContext<ICreatePatientForm>();

	const isPhoneWpp = useWatch({ control, name: 'isPhoneWpp' });
	const phone = useWatch({ control, name: 'phone' });
	const whatsapp = useWatch({ control, name: 'whatsapp' });
	const selectedType = useWatch({ control, name: 'preferredContact.type' });

	// Sync preferredContact.value from ContactsForm phone/whatsapp fields
	useEffect(() => {
		if (selectedType === 'whatsapp') {
			const whatsappValue = isPhoneWpp ? phone : whatsapp;
			if (whatsappValue) {
				setValue('preferredContact.value', whatsappValue, {
					shouldDirty: true,
				});
			}
		} else if (selectedType === 'phone' && phone) {
			setValue('preferredContact.value', phone, { shouldDirty: true });
		}
	}, [isPhoneWpp, phone, whatsapp, selectedType, setValue]);

	const handleTypeChange = (next: PreferredContactType) => {
		setValue('preferredContact.type', next, { shouldDirty: true });
		setValue('preferredContact.value', '', { shouldDirty: true });

		if (next === 'whatsapp') {
			// Signal ContactsForm to show WhatsApp input
			setValue('hasWhatsApp', true, { shouldDirty: true });
		} else {
			setValue('hasWhatsApp', false, { shouldDirty: true });
		}
	};

	const label = t('components.form.preferred-contact.label');

	return (
		<PreferredContactWrapper>
			<PreferredContactFields>
				<FormControl fullWidth>
					<PreferredContactUrlInputLabel
						htmlFor='preferred-contact-type'
						shrink
					>
						{label}
					</PreferredContactUrlInputLabel>
					<NativeSelect
						disabled={disabled}
						input={<OutlinedInput label={label} notched />}
						inputProps={{ id: 'preferred-contact-type' }}
						value={selectedType ?? ''}
						onChange={(e) =>
							handleTypeChange(e.target.value as PreferredContactType)
						}
					>
						<option value='' disabled>
							–
						</option>
						{PREFERRED_CONTACT_TYPES.map((type) => (
							<option key={type} value={type}>
								{t(`components.form.preferred-contact.type.${type}`)}
							</option>
						))}
					</NativeSelect>
				</FormControl>

				{selectedType && isUrlType(selectedType) && (
					<PreferredContactTypeSelect
						fullWidth
						disabled={disabled}
						label={t('components.form.preferred-contact.value-url')}
						type='url'
						helperText={t('components.form.preferred-contact.coming-soon')}
						{...register('preferredContact.value')}
					/>
				)}
			</PreferredContactFields>
		</PreferredContactWrapper>
	);
};
