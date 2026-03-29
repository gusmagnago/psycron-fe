import type { IClinicAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface ClinicSectionContentProps {
	clinicAddress?: IClinicAddress;
	onEditAddress: () => void;
	sessionType?: string;
}
