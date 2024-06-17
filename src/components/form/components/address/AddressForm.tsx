'use-client';
import { useState } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TextFieldProps } from '@mui/material';
import { Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { GOOGLE_MAPS_API_KEY } from '@psycron/utils/variables';
import type { Libraries } from '@react-google-maps/api';
import { Autocomplete, LoadScript } from '@react-google-maps/api';

import type {
	AddressComponent,
	AddressComponentProps,
} from './AddressForm.types';

const libraries: Libraries = ['places'];

export const AddressForm = <T extends FieldValues>({
	errors,
	register,
}: AddressComponentProps<T> & TextFieldProps) => {
	const { t } = useTranslation();

	const [addressComponents, setAddressComponents] = useState<AddressComponent>({
		address: '',
		streetNumber: '',
		route: '',
		sublocality: '',
		city: '',
		administrativeArea: '',
		country: '',
		postalCode: '',
	});

	const [addMoreInfo, setAddMoreInfo] = useState<boolean>(false);

	const handlePlaceSelect = (autocomplete: google.maps.places.Autocomplete) => {
		const place = autocomplete.getPlace();
		const updatedAddressComponents: Partial<AddressComponent> = {
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
			...prev,
			...updatedAddressComponents,
		}));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAddressComponents((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Grid
			container
			columnSpacing={3}
			rowSpacing={5}
			justifyContent='flex-end'
			p={4}
			component='form'
		>
			<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
				<Grid item xs={12}>
					<Autocomplete
						onLoad={(autocomplete) =>
							autocomplete.addListener('place_changed', () =>
								handlePlaceSelect(autocomplete)
							)
						}
					>
						<TextField
							id='addressSearch'
							name='addressSearch'
							label={t('components.form.address-form.search')}
							value={addressComponents.address}
							onChange={handleChange}
							fullWidth
						/>
					</Autocomplete>
					<Typography variant='caption' textAlign='center'>You can start searching for your address, or type it in the below fields</Typography>
				</Grid>
			</LoadScript>
			<Grid item xs={12} md={5}>
				<TextField
					label={t('components.form.address-form.street')}
					id='route'
					value={addressComponents.route}
					fullWidth
					{...register('route' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={4} md={2}>
				<TextField
					id='streetNumber'
					label={t('components.form.address-form.number')}
					value={addressComponents.streetNumber}
					fullWidth
					{...register('streetNumber' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={8} md={5}>
				<TextField
					id='sublocality'
					label={t('components.form.address-form.hood')}
					value={addressComponents.sublocality}
					fullWidth
					{...register('sublocality' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
				/>
			</Grid>
			{addMoreInfo ? (
				<Grid item xs={12}>
					<TextField
						id='moreInfo'
						label={t('components.form.address-form.more-info')}
						value={addressComponents.administrativeArea}
						fullWidth
						{...register('moreInfo' as Path<T>)}
						error={!!errors?.route}
						helperText={errors?.route?.message as string}
					/>
				</Grid>
			) : null}
			<Grid item xs={5} md={5}>
				<TextField
					id='political'
					label={t('components.form.address-form.city')}
					value={addressComponents.city}
					fullWidth
					{...register('city' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={7} md={4}>
				<TextField
					id='administrativeArea'
					label={t('components.form.address-form.state')}
					value={addressComponents.administrativeArea}
					fullWidth
					{...register('administrativeArea' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={4} md={3}>
				<TextField
					id='postalCode'
					label={t('components.form.address-form.zip')}
					value={addressComponents.postalCode}
					fullWidth
					{...register('postalCode' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
				/>
			</Grid>
			<Grid item xs={6} display='flex' alignItems='center' justifyContent='flex-end'>
				<FormControlLabel
					control={
						<Checkbox
							onChange={() => setAddMoreInfo((prev) => !prev)}
							value={addMoreInfo}
						/>
					}
					label={t('components.form.address-form.more-info-bttn')}
				/>
			</Grid>
			<Grid item xs={8} md={6}>
				<TextField
					id='country'
					label={t('components.form.address-form.country')}
					value={addressComponents.country}
					fullWidth
					{...register('country' as Path<T>)}
					error={!!errors?.route}
					helperText={errors?.route?.message as string}
					onChange={handleChange}
				/>
			</Grid>
		</Grid>
	);
};
