import { useEffect, useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { SelectChangeEvent } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import countryList from '@psycron/assets/countries/countries.json';
import { Logo } from '@psycron/components/icons';
import { Select } from '@psycron/components/Select/Select';
import { useUserGeolocation } from '@psycron/context/CountryContext';
import type { CountryDataSimple } from '@psycron/context/CountryContext.types';

import { CountryFlag } from './PhoneInput.styles';
import type { PhoneInputProps } from './PhoneInput.types';

export const PhoneInput = <T extends FieldValues>({
	register,
	registerName,
	errors,
}: PhoneInputProps<T>) => {
	const { t } = useTranslation();

	const { countryData } = useUserGeolocation();

	const [selectedCountry, setSelectedCountry] = useState<
    CountryDataSimple & { name?: string }
  >(countryData);

	useEffect(() => {
		setSelectedCountry({
			callingCode: countryData.callingCode,
			countryEmoji: countryData.countryEmoji,
			name: countryList.find((c) => c.dialCode === countryData.callingCode)
				?.name,
		});
	}, [countryData]);

	const countries = countryList.map((c) => ({
		name: c.name,
		value: c.dialCode,
	}));

	const handlePhoneChange = (e: SelectChangeEvent<string>) => {
		setSelectedCountry({
			callingCode: e.target.value,
			countryEmoji: countryList.find((c) => c.dialCode === e.target.value)
				?.flag,
		});
	};

	const inputRegisterName = t(`globals.${registerName}`)

	return (
		<Grid
			container
			columns={6}
			direction='row'
			justifyContent='flex-end'
			alignItems='center'
			columnSpacing={3}
		>
			<Grid item>
				<CountryFlag>
					{countryData.callingCode === null ? (
						<Logo />
					) : (
						<span>{selectedCountry?.countryEmoji}</span>
					)}
				</CountryFlag>
			</Grid>
			<Grid item xs={2}>
				<Select
					items={countries}
					required
					selectLabel={t('components.input.phone-input.select-label')}
					{...register(registerName as Path<T>)}
					subtitle
					value={selectedCountry.callingCode ?? ''}
					fullWidth
					onChangeSelect={handlePhoneChange}
					error={!!errors?.route}
				/>
			</Grid>
			<Grid item xs={3}>
				<TextField
					type='number'
					label={t('components.input.phone-input.phone-num-label', {
						registerName: inputRegisterName,
					})}
					required
					fullWidth
				/>
			</Grid>
		</Grid>
	);
};
