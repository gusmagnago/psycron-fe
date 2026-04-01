import { Controller, useFormContext } from 'react-hook-form';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';

import { GoogleTimezoneSearch } from './GoogleTimezoneSearch';

export const TimezoneSelect = () => {
	const { control } = useFormContext<ICreatePatientForm>();

	return (
		<Controller
			control={control}
			name='timeZone'
			render={({ field }) => (
				<GoogleTimezoneSearch
					initialValue={field.value}
					onTimezoneSelect={field.onChange}
				/>
			)}
		/>
	);
};
