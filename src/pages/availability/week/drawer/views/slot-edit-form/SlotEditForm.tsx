import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { Switch } from '@psycron/components/switch/components/item/Switch';

import { FormWrapper } from '../../AvailabilityWeekDrawer.styles';
import { SlotAddressFields } from '../slot-address-fields/SlotAddressFields';

import {
	AddressOverrideHeader,
	AddressOverrideLabel,
	AddressOverrideSection,
} from './SlotEditForm.styles';
import type { ISlotEditFormProps } from './SlotEditForm.types';

export const SlotEditForm = ({
	address,
	endTime,
	onAddressChange,
	onAddressClear,
	onEndTimeChange,
	onOverrideAddressToggle,
	onStartTimeChange,
	overrideAddress,
	showAddressSection,
	startTime,
}: ISlotEditFormProps) => {
	const { t } = useTranslation();

	return (
		<FormWrapper>
			<TextField
				fullWidth
				label={t('availability.week.drawer.edit-start-time')}
				onChange={(e) => onStartTimeChange(e.target.value)}
				size='small'
				type='time'
				value={startTime}
			/>
			<TextField
				fullWidth
				label={t('availability.week.drawer.edit-end-time')}
				onChange={(e) => onEndTimeChange(e.target.value)}
				size='small'
				type='time'
				value={endTime}
			/>
			{showAddressSection && (
				<AddressOverrideSection>
					<AddressOverrideHeader>
						<AddressOverrideLabel>
							{t('availability.week.drawer.address-override-question')}
						</AddressOverrideLabel>
						<Switch
							checked={overrideAddress}
							onChange={(e) => {
								onOverrideAddressToggle(e.target.checked);
								if (!e.target.checked) onAddressClear();
							}}
							small
						/>
					</AddressOverrideHeader>
					{overrideAddress && (
						<SlotAddressFields
							address={address}
							isAddressDirty={false}
							onChange={onAddressChange}
						/>
					)}
				</AddressOverrideSection>
			)}
		</FormWrapper>
	);
};
