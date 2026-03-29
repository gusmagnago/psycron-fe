import type { ReactNode } from 'react';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import type { LocationChoice } from '../../AvailabilityWeekDrawer.types';

export interface ISlotLocationSectionProps {
	customAddress: ISlotAddress | null;
	locationChoice: LocationChoice;
	onCustomAddressChange: (field: keyof ISlotAddress, value: string) => void;
	onLocationChoiceChange: (choice: LocationChoice) => void;
}

export interface ILocationOption {
	choice: LocationChoice;
	icon: ReactNode;
	labelKey: string;
	subtitleKey: string;
}
