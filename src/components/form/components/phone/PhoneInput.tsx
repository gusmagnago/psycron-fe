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

	return (
		<Grid
			container
			columns={6}
			direction='row'
			justifyContent='center'
			alignItems='center'
			columnSpacing={3}
			p={4}
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
					onChangeSelect={handlePhoneChange}
					subtitle
					value={selectedCountry.callingCode ?? ''}
					fullWidth
					{...register('phone' as Path<T>)}
					error={!!errors?.route}
				/>
			</Grid>
			<Grid item xs={3}>
				<TextField
					type='number'
					label={t('components.input.phone-input.phone-num-label')}
					required
					fullWidth
				/>
			</Grid>
		</Grid>
	);
};
