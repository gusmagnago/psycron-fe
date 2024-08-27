import type { ChangeEvent } from 'react';

export interface IGoogleAddressSearch {
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	handlePlaceSelect: (autocomplete: google.maps.places.Autocomplete) => void;
}
