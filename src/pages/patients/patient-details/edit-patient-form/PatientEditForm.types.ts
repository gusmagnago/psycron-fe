import type {
	ICreatePatientForm,
	PatientFormData,
} from '@psycron/api/patient/index.types';
import type {
	IPatient,
	ISlotAddress,
	PatientBillingCategory,
	PatientBillingModel,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface PatientEditFormValues extends ICreatePatientForm {
	address?: ISlotAddress | null;
	billing: {
		category: PatientBillingCategory;
		model: PatientBillingModel;
		monthlyPrice: {
			amount: number | '';
			currency: string;
		};
		sessionPrice: {
			amount: number | '';
			currency: string;
		};
	};
}

export interface PatientEditFormProps {
	onClose: () => void;
	open: boolean;
	patient: IPatient;
	therapistId: string;
}

export type PatientEditPayload = PatientFormData;
