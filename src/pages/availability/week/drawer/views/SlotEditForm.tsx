import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { Switch } from '@psycron/components/switch/components/item/Switch';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import {
	AddressOverrideHeader,
	AddressOverrideLabel,
	AddressOverrideSection,
	FormWrapper,
} from '../AvailabilityWeekDrawer.styles';

import { SlotAddressFields } from './SlotAddressFields';

interface ISlotEditFormProps {
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

export const SlotEditForm = ({
	address,
	endTime,
	note,
	onAddressChange,
	onAddressClear,
	onEndTimeChange,
	onNoteChange,
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
			<TextField
				fullWidth
				label={t('availability.week.drawer.edit-note')}
				maxRows={4}
				multiline
				onChange={(e) => onNoteChange(e.target.value)}
				size='small'
				value={note}
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
							size='small'
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
