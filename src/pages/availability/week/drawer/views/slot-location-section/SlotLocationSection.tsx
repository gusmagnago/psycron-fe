import { useTranslation } from 'react-i18next';
import { Address } from '@psycron/components/icons';
import { Switch } from '@psycron/components/switch/components/item/Switch';
import { palette } from '@psycron/theme/palette/palette.theme';

import {
	DrawerDetailIcon,
	ShareAddressLabel,
	ShareAddressRow,
} from '../../AvailabilityWeekDrawer.styles';
import { SlotAddressFields } from '../slot-address-fields/SlotAddressFields';

import {
	AddressOverrideHeader,
	AddressOverrideLabel,
	AddressOverrideSection,
	SlotLocationContent,
} from './SlotLocationSection.styles';
import type { ISlotLocationSectionProps } from './SlotLocationSection.types';

export const SlotLocationSection = ({
	address,
	isAddressDirty,
	isAddressSaving,
	letPatientChoose,
	onAddressChange,
	onAddressSave,
	onLetPatientChooseToggle,
	onOverrideAddressToggle,
	onShareAddressToggle,
	overrideAddress,
	shareAddress,
}: ISlotLocationSectionProps) => {
	const { t } = useTranslation();

	return (
		<AddressOverrideSection>
			<DrawerDetailIcon>
				<Address color={palette.brand.purple} />
			</DrawerDetailIcon>

			<SlotLocationContent>
				<ShareAddressRow>
					<ShareAddressLabel>
						{t('availability.week.drawer.let-patient-choose-address')}
					</ShareAddressLabel>
					<Switch
						checked={letPatientChoose}
						onChange={(e) => onLetPatientChooseToggle(e.target.checked)}
					/>
				</ShareAddressRow>

				{!letPatientChoose && (
					<>
						<ShareAddressRow>
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
					</>
				)}
			</SlotLocationContent>
		</AddressOverrideSection>
	);
};
