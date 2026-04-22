import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, TextField } from '@mui/material';
import { GoogleAutocompleteGlobalStyles } from '@psycron/components/form/components/address/GoogleAddressSearch/GoogleAddressSearch.styles';
import {
	GOOGLE_MAPS_API_KEY,
	PSYCRON_BASE_API,
} from '@psycron/utils/variables';
import type { Libraries } from '@react-google-maps/api';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';

import type { IGoogleTimezoneSearch } from './GoogleTimezoneSearch.types';

const LIBRARIES: Libraries = ['places'];

const AUTOCOMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
	types: ['(cities)'],
};

const fetchTimezoneId = async (
	lat: number,
	lng: number
): Promise<{ id: string; name: string } | null> => {
	try {
		const res = await fetch(
			`${PSYCRON_BASE_API}/utils/timezone?lat=${lat}&lng=${lng}`
		);
		const data = (await res.json()) as { id: string; name: string };
		if (data.id) return data;
	} catch {
		// fall through
	}
	return null;
};

export const GoogleTimezoneSearch = ({
	initialValue,
	onTimezoneSelect,
}: IGoogleTimezoneSearch) => {
	const { t } = useTranslation();
	const [inputValue, setInputValue] = useState('');
	const [detectedTz, setDetectedTz] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const prevInitialRef = useRef(initialValue);
	useEffect(() => {
		if (initialValue && initialValue !== prevInitialRef.current) {
			setDetectedTz(initialValue);
			setInputValue(initialValue);
		}
		prevInitialRef.current = initialValue;
	}, [initialValue]);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: GOOGLE_MAPS_API_KEY,
		libraries: LIBRARIES,
	});

	if (!isLoaded || loadError) return null;

	return (
		<>
			<GoogleAutocompleteGlobalStyles />
			<Autocomplete
				onLoad={(ac) => {
					ac.addListener('place_changed', async () => {
						const place = ac.getPlace();
						if (!place?.geometry?.location) return;

						const lat = place.geometry.location.lat();
						const lng = place.geometry.location.lng();

						setLoading(true);
						const tz = await fetchTimezoneId(lat, lng);
						setLoading(false);

						if (tz) {
							setDetectedTz(tz.name);
							setInputValue(place.name ?? place.formatted_address ?? '');
							onTimezoneSelect(tz.id);
						}
					});
				}}
				options={AUTOCOMPLETE_OPTIONS}
			>
				<TextField
					fullWidth
					label={t('availability.week.drawer.patient-timezone')}
					placeholder={
						initialValue ||
						t('availability.week.drawer.patient-timezone-placeholder')
					}
					value={inputValue}
					helperText={detectedTz ?? undefined}
					onChange={(e) => {
						setInputValue(e.target.value);
						if (detectedTz) {
							setDetectedTz(null);
							onTimezoneSelect('');
						}
					}}
					slotProps={{
						input: {
							endAdornment: loading ? (
								<CircularProgress size={16} />
							) : undefined,
						},
					}}
				/>
			</Autocomplete>
		</>
	);
};
