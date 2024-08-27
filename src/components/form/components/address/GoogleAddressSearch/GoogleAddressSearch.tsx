import { useTranslation } from 'react-i18next';
import { Grid, TextField } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { GOOGLE_MAPS_API_KEY } from '@psycron/utils/variables';
import type { Libraries } from '@react-google-maps/api';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';

import type { IGoogleAddressSearch } from './GoogleAddressSearch.types';

const LIBRARIES: Libraries = ['places'];

export const GoogleAddressSearch = ({
	handleChange,
	handlePlaceSelect,
}: IGoogleAddressSearch) => {
	const { t } = useTranslation();

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: GOOGLE_MAPS_API_KEY,
		libraries: LIBRARIES,
	});

	return (
		<>
			{!loadError || isLoaded ? (
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
							onChange={handleChange}
							fullWidth
						/>
					</Autocomplete>
					<Text variant='caption' textAlign='center' textTransform='initial'>
						{t('components.form.address-form.search-note')}
					</Text>
				</Grid>
			) : null}
		</>
	);
};
