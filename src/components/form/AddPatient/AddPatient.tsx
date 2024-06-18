import type { BaseSyntheticEvent } from 'react'
import type { FieldValues, SubmitErrorHandler,SubmitHandler } from 'react-hook-form'
import { Grid } from '@mui/material'

import { FormWrapper } from '../FormWrapper/FormWrapper'

export const AddPatientForm = () => {
	return (
		<FormWrapper formDescription='add-patient-inputs' formTitle='add-patient' handleSubmit={} onSubmit={undefined} submitButtonLabel={''} open={false}>
			<Grid>

			</Grid>
		</FormWrapper>
	)
}