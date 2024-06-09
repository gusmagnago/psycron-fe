import {  useEffect, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import { Box, TextField } from '@mui/material';
import countryList from '@psycron/assets/countries/countries.json';
import { Logo } from '@psycron/components/icons';
import { Select } from '@psycron/components/Select/Select';
import {  useUserGeolocation } from '@psycron/context/CountryContext';
import type { CountryDataSimple } from '@psycron/context/CountryContext.types';

import { CountryFlag } from './PhoneInput.styles';
// import type { PhoneInputProps } from './PhoneInput.types';

export const PhoneInput = () => {
	const { countryData } = useUserGeolocation()

	const [selectedCountry, setSelectedCountry] = useState<CountryDataSimple & {name?: string}>(countryData);

	useEffect(() => {
		setSelectedCountry({
			callingCode: countryData.callingCode,
			countryEmoji: countryData.countryEmoji,
			name: countryList.find((c) => c.dialCode === countryData.callingCode)?.name
		});
	}, [countryData]);

	const countries = countryList.map((c) => ({
		name: c.name,
		value: c.dialCode
	}))

    
	const handlePhoneChange = (e: SelectChangeEvent<string>) => {
		setSelectedCountry({
			callingCode: e.target.value,
			countryEmoji: countryList.find((c) => c.dialCode === e.target.value)?.flag
		});
	}

	return (
		<Box display='flex' flexDirection='row' alignItems='center'>
			<CountryFlag>
				{countryData.callingCode === null ? (
					<Logo />
				) : (
					<span>{selectedCountry?.countryEmoji}</span>
				)}
			</CountryFlag>
			<Select
				items={countries}
				required
				selectLabel='Country'
				onChangeSelect={handlePhoneChange}
				subtitle
				value={selectedCountry.callingCode ?? ''}
				name={selectedCountry.name ?? ''}
				width='auto'
			/>
			<TextField type='number' label='Your Phone Number here' required />
		</Box>
	);
};
