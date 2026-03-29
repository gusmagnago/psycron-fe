import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface ISlotEditFormProps {
	address: ISlotAddress | null;
	endTime: string;
	note: string;
	onAddressChange: (field: keyof ISlotAddress, value: string) => void;
	onAddressClear: () => void;
	onEndTimeChange: (val: string) => void;
	onNoteChange: (val: string) => void;
	onOverrideAddressToggle: (val: boolean) => void;
	onStartTimeChange: (val: string) => void;
	overrideAddress: boolean;
	showAddressSection: boolean;
	startTime: string;
}
