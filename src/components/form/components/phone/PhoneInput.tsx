import { useMemo, useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Country } from 'react-phone-number-input';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en';
import pt from 'react-phone-number-input/locale/pt';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { useUserGeolocation } from '@psycron/context/geolocation/CountryContext';
import { palette } from '@psycron/theme/palette/palette.theme';

import 'react-phone-number-input/style.css';

import { ALLOWED_COUNTRIES } from './utils/countries';
import { getPathError } from './utils/getPathError';
import { StyledPhoneInput } from './PhoneInput.styles';
import type { PhoneInputComponentProps } from './PhoneInput.types';

export const PhoneInputComponent = <T extends FieldValues>({
	name,
	defaultValue,
	disabled,
	labelKey,
	required,
	validateFn,
}: PhoneInputComponentProps<T>) => {
	const { t } = useTranslation();
	const { locale } = useParams<{ locale?: string }>();
	const { countryData } = useUserGeolocation();

	const [focused, setFocused] = useState(false);
	const labels = useMemo(() => (locale === 'pt' ? pt : en), [locale]);

	const defaultCountry = useMemo<Country>(() => {
		const detected = countryData.countryCode2 as Country | undefined;
		if (detected && ALLOWED_COUNTRIES.includes(detected)) return detected;
		return 'BR';
	}, [countryData.countryCode2]);

	const {
		control,
		formState: { errors },
	} = useFormContext<T>();

	const error = useMemo(
		() => getPathError(errors, String(name)),
		[errors, name]
	);
	const helperFromRhf =
		typeof error?.message === 'string' ? error.message : null;

	const inputLabel = labelKey ? t(labelKey) : t('globals.phone');

	return (
		<Box width='100%'>
			<Controller
				name={name}
				control={control}
				defaultValue={(defaultValue ?? '') as unknown as T[Path<T>]}
				rules={{
					validate: (value) => {
						const v = typeof value === 'string' ? value.trim() : '';
						if (!v) {
							if (validateFn) return validateFn(v);
							return required ? t('globals.required', 'Required') : true;
						}
						return isValidPhoneNumber(v)
							? true
							: t(
									'components.input.phone-input.invalid',
									'Invalid phone number'
								);
					},
				}}
				render={({ field }) => (
					<StyledPhoneInput
						isFocused={focused}
						hasError={Boolean(error)}
						isDisabled={Boolean(disabled)}
					>
						<PhoneInput
							labels={labels}
							defaultCountry={defaultCountry}
							countries={ALLOWED_COUNTRIES}
							value={field.value as string | undefined}
							onChange={field.onChange}
							onBlur={() => {
								field.onBlur();
								setFocused(false);
							}}
							onFocus={() => setFocused(true)}
							disabled={disabled}
							autoComplete='tel'
							placeholder={t('components.input.phone-input.phone-num-label', {
								registerName: inputLabel,
							})}
						/>
					</StyledPhoneInput>
				)}
			/>

			{helperFromRhf ? (
				<Text variant='caption' color={palette.error.main}>
					{helperFromRhf}
				</Text>
			) : null}
		</Box>
	);
};
