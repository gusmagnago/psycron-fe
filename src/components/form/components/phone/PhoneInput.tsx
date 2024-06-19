import { useEffect, useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { SelectChangeEvent } from '@mui/material';
import { Grid, IconButton, Tooltip } from '@mui/material';
import countryList from '@psycron/assets/countries/countries.json';
import { Info, Logo } from '@psycron/components/icons';
import { Select } from '@psycron/components/Select/Select';
import { useUserGeolocation } from '@psycron/context/CountryContext';
import type { CountryDataSimple } from '@psycron/context/CountryContext.types';
import { palette } from '@psycron/theme/palette/palette.theme';

import { CountryFlag, PhoneNumberField } from './PhoneInput.styles';
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

	const inputRegisterName = t(`globals.${registerName}`);

	return (
		<Grid
			container
			columns={12}
			direction='row'
			alignItems='center'
			columnSpacing={2}
		>
			<Grid item xs={2}>
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
				/>
			</Grid>
			<Grid item xs={5}>
				<PhoneNumberField
					type='tel'
					label={t('components.input.phone-input.phone-num-label', {
						registerName: inputRegisterName,
					})}
					required
					fullWidth
					{...register(registerName as Path<T>)}
					error={!!errors?.[registerName]}
					helperText={errors?.[registerName]?.message as string}
				/>
			</Grid>
			<Grid item xs={1}>
				<Tooltip
					title={t('components.input.phone-input.phone-number-guide')}
					arrow
				>
					<IconButton>
						<Info color={palette.info.main} />
					</IconButton>
				</Tooltip>

			</Grid>
		</Grid>
	);
};
