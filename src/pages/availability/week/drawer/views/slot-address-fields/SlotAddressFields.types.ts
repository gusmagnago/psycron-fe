import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface ISlotAddressFieldsProps {
	address: ISlotAddress | null;
	isAddressDirty: boolean;
	isAddressSaving?: boolean;
	onAddressSave?: () => void;
	onChange: (field: keyof ISlotAddress, value: string) => void;
}
