/* eslint-disable indent */
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TextFieldProps } from '@mui/material';
import { Grid, TextField } from '@mui/material';
import { Switch } from '@psycron/components/switch/components/item/Switch';
import type { IAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import { GoogleAddressSearch } from './GoogleAddressSearch/GoogleAddressSearch';
import { ComplementaryField } from './AddressForm.styles';
import type { AddressComponentProps } from './AddressForm.types';

export const AddressForm = <T extends FieldValues>({
	errors,
	register,
	defaultValues,
	disabled,
	showGoogleAddressSearch,
}: AddressComponentProps<T> & TextFieldProps) => {
	const { t } = useTranslation();

	const defaultAddressVal = {
		address: '',
		streetNumber: '',
		route: '',
		sublocality: '',
		city: '',
		administrativeArea: '',
		country: '',
		postalCode: '',
	};

	const [addressComponents, setAddressComponents] = useState<
		IAddress | undefined
	>(defaultValues || defaultAddressVal);

	const [addMoreInfo, setAddMoreInfo] = useState<boolean>(false);

	const handlePlaceSelect = (autocomplete: google.maps.places.Autocomplete) => {
		const place = autocomplete.getPlace();

		const updatedAddressComponents: Partial<IAddress> = {
			address: place.formatted_address || '',
		};

		place.address_components?.forEach((component) => {
			const componentType = component.types[0];
			switch (componentType) {
				case 'street_number':
					updatedAddressComponents.streetNumber = component.long_name;
					break;
				case 'route':
					updatedAddressComponents.route = component.long_name;
					break;
				case 'sublocality_level_1':
				case 'sublocality':
					updatedAddressComponents.sublocality = component.long_name;
					break;
				case 'political':
				case 'locality':
				case 'administrative_area_level_2':
					updatedAddressComponents.city = component.long_name;
					break;
				case 'administrative_area_level_1':
					updatedAddressComponents.administrativeArea = component.long_name;
					break;
				case 'country':
					updatedAddressComponents.country = component.long_name;
					break;
				case 'postal_code':
					updatedAddressComponents.postalCode = component.long_name;
					break;
				default:
					break;
			}
		});

		setAddressComponents((prev) => ({
			...(prev ?? defaultAddressVal),
			...updatedAddressComponents,
		}));
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAddressComponents((prev) => ({
			...(prev ?? defaultAddressVal),
			[name]: value,
		}));
	};

	return (
		<Grid container columnSpacing={5} rowSpacing={5} pt={2} pb={5}>
			{showGoogleAddressSearch ? (
				<GoogleAddressSearch
					handleChange={handleChange}
					handlePlaceSelect={handlePlaceSelect}
				/>
			) : null}
			<Grid item xs={12} md={8}>
				<TextField
					label={t('components.form.address-form.street')}
					id='route'
					value={addressComponents?.route}
					fullWidth
					{...register('route' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
					autoComplete='route'
					required
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={4} md={4}>
				<TextField
					id='streetNumber'
					label={t('components.form.address-form.number')}
					value={addressComponents?.streetNumber}
					fullWidth
					{...register('streetNumber' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
					autoComplete='streetNumber'
					required
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={8} md={6}>
				<TextField
					id='sublocality'
					label={t('components.form.address-form.hood')}
					value={addressComponents?.sublocality}
					fullWidth
					{...register('sublocality' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
					autoComplete='sublocality'
					required
					disabled={disabled}
				/>
			</Grid>
			{addMoreInfo ? (
				<Grid item xs={12}>
					<ComplementaryField
						id='moreInfo'
						label={t('components.form.address-form.more-info')}
						value={addressComponents?.administrativeArea}
						fullWidth
						{...register('moreInfo' as Path<T>)}
						error={!!errors?.route}
						helperText={errors?.route?.message as string}
					/>
				</Grid>
			) : null}
			<Grid item xs={5} md={6}>
				<TextField
					id='political'
					label={t('components.form.address-form.city')}
					value={addressComponents?.city}
					fullWidth
					{...register('city' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
					autoComplete='political'
					required
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={7} md={6}>
				<TextField
					id='administrativeArea'
					label={t('components.form.address-form.state')}
					value={addressComponents?.administrativeArea}
					fullWidth
					{...register('administrativeArea' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
					autoComplete='administrativeArea'
					required
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={4} md={6}>
				<TextField
					id='postalCode'
					label={t('components.form.address-form.zip')}
					value={addressComponents?.postalCode}
					fullWidth
					{...register('postalCode' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
					autoComplete='pCode'
					required
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={8} md={6}>
				<TextField
					id='country'
					label={t('components.form.address-form.country')}
					value={addressComponents?.country}
					fullWidth
					{...register('country' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
					autoComplete='count'
					required
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={8} display='flex' alignItems='center'>
				<Switch
					onChange={() => setAddMoreInfo((prev) => !prev)}
					value={addMoreInfo}
					label={t('components.form.address-form.more-info-bttn')}
					disabled={disabled}
				/>
			</Grid>
		</Grid>
	);
};
