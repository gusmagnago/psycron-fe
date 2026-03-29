import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface ISlotLocationSectionProps {
	address: ISlotAddress | null;
	isAddressDirty: boolean;
	isAddressSaving: boolean;
	letPatientChoose: boolean;
	onAddressChange: (field: keyof ISlotAddress, value: string) => void;
	onAddressSave: () => void;
	onLetPatientChooseToggle: (val: boolean) => void;
	onOverrideAddressToggle: (val: boolean) => void;
	onShareAddressToggle: (val: boolean) => void;
	overrideAddress: boolean;
	shareAddress: boolean;
}
