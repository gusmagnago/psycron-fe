import type { Path } from 'react';
import { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Grid, Select, type SelectChangeEvent, Tooltip } from '@mui/material';
import countryList from '@psycron/assets/countries/countries.json';
import { Info, Logo } from '@psycron/components/icons';
import { useUserGeolocation } from '@psycron/context/CountryContext';
import type { CountryDataSimple } from '@psycron/context/CountryContext.types';
import { palette } from '@psycron/theme/palette/palette.theme';

import { CountryFlag, PhoneNumberField } from './PhoneInput.styles';
import type { PhoneInputProps } from './PhoneInput.types';

export const PhoneInput = <T extends FieldValues>({
	register,
	registerName,
	errors,
	defaultValue,
	disabled,
}: PhoneInputProps<T>) => {
	const { t } = useTranslation();

	const { countryData } = useUserGeolocation();

	const [selectedCountry, setSelectedCountry] = useState<
    CountryDataSimple & { name?: string }
  >(countryData);

	const [defaultNumberVal, setDefaultNumberVal] = useState<string>('');

	const countries = countryList.map((c) => ({
		name: c.name,
		value: c.dialCode,
	}));

	const findCountry = (
		countries: { name: string; value: string }[],
		value?: string
	) => countries.find((country) => value?.includes(country.value));

	const foundCountryCode = findCountry(countries, defaultValue);

	const flag = countryList.find(
		(c) => c.dialCode === foundCountryCode?.value
	)?.flag;

	useEffect(() => {
		if (defaultValue) {
			setDefaultNumberVal(
				defaultValue?.replace(String(foundCountryCode?.value), '')
			);
			setSelectedCountry({
				callingCode: foundCountryCode!.value,
				countryEmoji: flag,
				name: countryList.find((c) => c.dialCode === foundCountryCode?.value)
					?.name,
			});
		} else {
			setSelectedCountry({
				callingCode: countryData.callingCode,
				countryEmoji: countryData.countryEmoji,
				name: countryList.find((c) => c.dialCode === countryData.callingCode)
					?.name,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countryData]);

	const handlePhoneChange = (e: SelectChangeEvent<string>) => {
		setSelectedCountry({
			callingCode: e.target.value,
			countryEmoji: countryList.find((c) => c.dialCode === e.target.value)
				?.flag,
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDefaultNumberVal(e.target.value);
	};

	const inputRegisterName = t(`globals.${registerName}`);

	return (
		<Grid
			container
			columns={12}
			direction='row'
			alignItems='center'
			columnSpacing={2}
		>
			<Grid item xs={1}>
				<CountryFlag>
					{countryData.callingCode === null ? (
						<Logo />
					) : (
						<span>{selectedCountry?.countryEmoji}</span>
					)}
				</CountryFlag>
			</Grid>
			<Grid item xs={4}>
				<Select
					items={countries}
					required
					selectLabel={t('components.input.phone-input.select-label')}
					{...register('countryCode' as Path<T>)}
					subtitle
					value={selectedCountry.callingCode ?? ''}
					fullWidth
					onChangeSelect={handlePhoneChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={6.5}>
				<PhoneNumberField
					type='tel'
					label={t('components.input.phone-input.phone-num-label', {
						registerName: inputRegisterName,
					})}
					required
					fullWidth
					value={defaultNumberVal}
					{...register(registerName as Path<T>)}
					error={!!errors?.[registerName]}
					helperText={errors?.[registerName]?.message as string}
					onChange={handleInputChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={0.5}>
				<Tooltip title={t('components.input.phone-input.phone-number-guide')}>
					<Info color={palette.info.main} />
				</Tooltip>
			</Grid>
		</Grid>
	);
};
