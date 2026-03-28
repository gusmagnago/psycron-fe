import type { UseFormReturn } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { NameForm } from '@psycron/components/form/components/name/NameForm';
import { Address } from '@psycron/components/icons';
import { Switch } from '@psycron/components/switch/components/item/Switch';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { palette } from '@psycron/theme/palette/palette.theme';

import {
	AddressOverrideHeader,
	AddressOverrideLabel,
	AddressOverrideSection,
	DrawerDetailIcon,
	FormWrapper,
	ShareAddressLabel,
	ShareAddressRow,
} from '../AvailabilityWeekDrawer.styles';

import { SlotAddressFields } from './SlotAddressFields';

interface ISlotAvailableBodyProps {
	address: ISlotAddress | null;
	isAddressDirty: boolean;
	isAddressSaving: boolean;
	methods: UseFormReturn<ICreatePatientForm>;
	onAddressChange: (field: keyof ISlotAddress, value: string) => void;
	onAddressSave: () => void;
	onOverrideAddressToggle: (val: boolean) => void;
	onShareAddressToggle: (val: boolean) => void;
	overrideAddress: boolean;
	shareAddress: boolean;
	showSessionLocation: boolean;
}

export const SlotAvailableBody = ({
	address,
	isAddressDirty,
	isAddressSaving,
	methods,
	onAddressChange,
	onAddressSave,
	onOverrideAddressToggle,
	onShareAddressToggle,
	overrideAddress,
	shareAddress,
	showSessionLocation,
}: ISlotAvailableBodyProps) => {
	const { t } = useTranslation();

	return (
		<>
			<FormProvider {...methods}>
				<Box component='form'>
					<FormWrapper>
						<NameForm<ICreatePatientForm>
							required
							fields={{ firstName: 'firstName', lastName: 'lastName' }}
							labelFirstName={t('availability.week.drawer.patient-first-name')}
							labelLastName={t('availability.week.drawer.patient-last-name')}
							placeholderFirstName={t(
								'availability.week.drawer.patient-first-name'
							)}
							placeholderLastName={t(
								'availability.week.drawer.patient-last-name'
							)}
						/>
						<ContactsForm<ICreatePatientForm>
							atLeastOneContact
							fullWidth
							fields={{
								email: 'email',
								hasWhatsApp: 'hasWhatsApp',
								isPhoneWpp: 'isPhoneWpp',
								phone: 'phone',
								whatsapp: 'whatsapp',
							}}
							labelEmail={t('availability.week.drawer.patient-email')}
							placeholderEmail={t('availability.week.drawer.patient-email')}
						/>
					</FormWrapper>
				</Box>
			</FormProvider>

			{showSessionLocation && (
				<AddressOverrideSection>
					<ShareAddressRow>
						<DrawerDetailIcon>
							<Address color={palette.brand.purple} />
						</DrawerDetailIcon>
						<ShareAddressLabel>
							{t('availability.week.drawer.share-address')}
						</ShareAddressLabel>
						<Switch
							checked={shareAddress}
							onChange={(e) => onShareAddressToggle(e.target.checked)}
						/>
					</ShareAddressRow>

					{!shareAddress && (
						<>
							<AddressOverrideHeader>
								<AddressOverrideLabel>
									{t('availability.week.drawer.address-override-question')}
								</AddressOverrideLabel>
								<Switch
									checked={overrideAddress}
									onChange={(e) => onOverrideAddressToggle(e.target.checked)}
								/>
							</AddressOverrideHeader>

							{overrideAddress && (
								<SlotAddressFields
									address={address}
									isAddressDirty={isAddressDirty}
									isAddressSaving={isAddressSaving}
									onAddressSave={onAddressSave}
									onChange={onAddressChange}
								/>
							)}
						</>
					)}
				</AddressOverrideSection>
			)}
		</>
	);
};
