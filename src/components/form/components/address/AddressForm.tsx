import type { ChangeEvent } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Grid, TextField } from '@mui/material';

import { GoogleAddressSearch } from './GoogleAddressSearch/GoogleAddressSearch';
import type { AddressFormProps } from './AddressForm.types';

export const AddressForm = <T extends FieldValues>({
	disabled,
	fields,
	showGoogleAddressSearch,
}: AddressFormProps<T>) => {
	const { t } = useTranslation();

	const { register, setValue, watch, getFieldState } = useFormContext<T>();

	const streetPath = (fields?.street ?? ('clinicAddress.street' as Path<T>)) as Path<T>;
	const cityPath = (fields?.city ?? ('clinicAddress.city' as Path<T>)) as Path<T>;
	const postcodePath = (fields?.postcode ?? ('clinicAddress.postcode' as Path<T>)) as Path<T>;
	const countryPath = (fields?.country ?? ('clinicAddress.country' as Path<T>)) as Path<T>;

	const streetState = getFieldState(streetPath);
	const cityState = getFieldState(cityPath);
	const postcodeState = getFieldState(postcodePath);
	const countryState = getFieldState(countryPath);

	const handlePlaceSelect = (autocomplete: google.maps.places.Autocomplete) => {
		const place = autocomplete.getPlace();

		place.address_components?.forEach((component) => {
			const componentType = component.types[0];
			switch (componentType) {
				case 'route':
					setValue(streetPath, component.long_name as never, { shouldDirty: true });
					break;
				case 'political':
				case 'locality':
				case 'administrative_area_level_2':
					setValue(cityPath, component.long_name as never, { shouldDirty: true });
					break;
				case 'postal_code':
					setValue(postcodePath, component.long_name as never, { shouldDirty: true });
					break;
				case 'country':
					setValue(countryPath, component.long_name as never, { shouldDirty: true });
					break;
				default:
					break;
			}
		});
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValue(name as Path<T>, value as never, { shouldDirty: true });
	};

	return (
		<Grid container columnSpacing={5} rowSpacing={5} pt={2} pb={5}>
			{showGoogleAddressSearch ? (
				<GoogleAddressSearch
					handleChange={handleChange}
					handlePlaceSelect={handlePlaceSelect}
				/>
			) : null}
			<Grid size={{ xs: 12 }}>
				<TextField
					label={t('components.form.address-form.street')}
					id={String(streetPath)}
					fullWidth
					{...register(streetPath)}
					value={watch(streetPath) ?? ''}
					error={Boolean(streetState.error)}
					helperText={streetState.error?.message as string | undefined}
					autoComplete='street-address'
					disabled={disabled}
					slotProps={{ htmlInput: { 'data-testid': 'address-form-street' } }}
				/>
			</Grid>
			<Grid size={{ xs: 12, md: 6 }}>
				<TextField
					label={t('components.form.address-form.city')}
					id={String(cityPath)}
					fullWidth
					{...register(cityPath)}
					value={watch(cityPath) ?? ''}
					error={Boolean(cityState.error)}
					helperText={cityState.error?.message as string | undefined}
					autoComplete='address-level2'
					disabled={disabled}
					slotProps={{ htmlInput: { 'data-testid': 'address-form-city' } }}
				/>
			</Grid>
			<Grid size={{ xs: 12, md: 6 }}>
				<TextField
					label={t('components.form.address-form.zip')}
					id={String(postcodePath)}
					fullWidth
					{...register(postcodePath)}
					value={watch(postcodePath) ?? ''}
					error={Boolean(postcodeState.error)}
					helperText={postcodeState.error?.message as string | undefined}
					autoComplete='postal-code'
					disabled={disabled}
					slotProps={{ htmlInput: { 'data-testid': 'address-form-postcode' } }}
				/>
			</Grid>
			<Grid size={{ xs: 12 }}>
				<TextField
					label={t('components.form.address-form.country')}
					id={String(countryPath)}
					fullWidth
					{...register(countryPath)}
					value={watch(countryPath) ?? ''}
					error={Boolean(countryState.error)}
					helperText={countryState.error?.message as string | undefined}
					autoComplete='country-name'
					disabled={disabled}
					slotProps={{ htmlInput: { 'data-testid': 'address-form-country' } }}
				/>
			</Grid>
		</Grid>
	);
};
