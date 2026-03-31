import { useMemo, useRef, useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
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
		trigger,
	} = useFormContext<T>();

	// Tracks whether the user has typed anything — needed because the library
	// calls onChange(undefined) for numbers it can't format as E.164 (e.g.
	// invalid local number parts), making the field look "empty" to validate.
	const hasInteractedRef = useRef(!!defaultValue);

	const phoneValue = useWatch({ control, name });

	const error = useMemo(
		() => getPathError(errors, String(name)),
		[errors, name]
	);
	const helperFromRhf =
		typeof error?.message === 'string' ? error.message : null;

	const isValid =
		!helperFromRhf &&
		hasInteractedRef.current &&
		typeof phoneValue === 'string' &&
		!!phoneValue &&
		isValidPhoneNumber(phoneValue);

	const invalidMsg = t('components.input.phone-input.invalid', 'Invalid phone number');

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
							// Library returned undefined: either empty or unparseable number.
							// If the user has typed something, treat it as invalid.
							if (hasInteractedRef.current) return invalidMsg;
							if (validateFn) return validateFn(v);
							return required ? t('common.required', 'Required') : true;
						}
						return isValidPhoneNumber(v) ? true : invalidMsg;
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
							onChange={(val) => {
								hasInteractedRef.current = true;
								field.onChange(val);
							}}
							onBlur={() => {
								field.onBlur();
								void trigger(name);
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
			) : isValid ? (
				<Text variant='caption' color={palette.success.main}>
					{t('components.input.phone-input.valid', 'Valid phone number')}
				</Text>
			) : null}
		</Box>
	);
};
