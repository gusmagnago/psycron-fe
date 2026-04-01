import { useTranslation } from 'react-i18next';
import {
	Autocomplete,
	CircularProgress,
	TextField,
} from '@mui/material';
import type { IPatientSearchResult } from '@psycron/api/user/availability/index.types';

import {
	AutocompleteWrapper,
	OptionContact,
	OptionName,
	OptionWrapper,
} from './PatientNameAutocomplete.styles';
import type { IPatientNameAutocompleteProps } from './PatientNameAutocomplete.types';

const getOptionLabel = (option: IPatientSearchResult | string): string => {
	if (typeof option === 'string') return option;
	return `${option.firstName} ${option.lastName}`;
};

export const PatientNameAutocomplete = ({
	methods,
	onPatientSelect,
	onSelectionClear,
	results,
	searchIsLoading,
	searchQuery,
	selectedPatient,
	setSearchQuery,
}: IPatientNameAutocompleteProps) => {
	const { t } = useTranslation();
	const {
		formState: { errors },
		setValue,
	} = methods;

	const firstNameError = errors.firstName;

	return (
		<AutocompleteWrapper>
			<Autocomplete<IPatientSearchResult, false, false, true>
				freeSolo
				options={results}
				getOptionLabel={getOptionLabel}
				value={selectedPatient}
				inputValue={searchQuery}
				loading={searchIsLoading}
				noOptionsText={
					searchQuery.length >= 2
						? t('availability.week.drawer.patient-search.no-results')
						: t('availability.week.drawer.patient-search.type-to-search')
				}
				filterOptions={(x) => x}
				isOptionEqualToValue={(option, value) => option._id === value._id}
				onInputChange={(_event, newValue, reason) => {
					if (reason === 'input') {
						setSearchQuery(newValue);
						setValue('firstName', newValue, { shouldValidate: true });
					}
					if (reason === 'clear') {
						onSelectionClear();
					}
				}}
				onChange={(_event, newValue) => {
					if (newValue && typeof newValue !== 'string') {
						onPatientSelect(newValue);
					} else if (!newValue) {
						onSelectionClear();
					}
				}}
				renderOption={(props, option) => (
					<li {...props} key={option._id}>
						<OptionWrapper>
							<OptionName>
								{option.firstName} {option.lastName}
							</OptionName>
							<OptionContact>
								{option.contacts.email ?? option.contacts.phone ?? ''}
							</OptionContact>
						</OptionWrapper>
					</li>
				)}
				renderInput={(params) => (
					<TextField
						{...params}
						label={t('availability.week.drawer.patient-first-name')}
						placeholder={t('availability.week.drawer.patient-search.placeholder')}
						required
						error={Boolean(firstNameError)}
						helperText={
							typeof firstNameError?.message === 'string'
								? firstNameError.message
								: undefined
						}
						slotProps={{
							input: {
								...params.InputProps,
								endAdornment: (
									<>
										{searchIsLoading ? (
											<CircularProgress color='inherit' size={20} />
										) : null}
										{params.InputProps.endAdornment}
									</>
								),
							},
						}}
					/>
				)}
			/>
		</AutocompleteWrapper>
	);
};
