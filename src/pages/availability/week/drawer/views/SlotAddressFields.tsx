import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

interface ISlotAddressFieldsProps {
	address: ISlotAddress | null;
	isAddressDirty: boolean;
	isAddressSaving?: boolean;
	onAddressSave?: () => void;
	onChange: (field: keyof ISlotAddress, value: string) => void;
}

export const SlotAddressFields = ({
	address,
	isAddressDirty,
	isAddressSaving,
	onAddressSave,
	onChange,
}: ISlotAddressFieldsProps) => {
	const { t } = useTranslation();

	return (
		<>
			<TextField
				fullWidth
				label={t('components.form.address-form.street')}
				onChange={(e) => onChange('street', e.target.value)}
				size='small'
				value={address?.street ?? ''}
			/>
			<TextField
				fullWidth
				label={t('components.form.address-form.city')}
				onChange={(e) => onChange('city', e.target.value)}
				size='small'
				value={address?.city ?? ''}
			/>
			<TextField
				fullWidth
				label={t('components.form.address-form.zip')}
				onChange={(e) => onChange('postcode', e.target.value)}
				size='small'
				value={address?.postcode ?? ''}
			/>
			<TextField
				fullWidth
				label={t('components.form.address-form.country')}
				onChange={(e) => onChange('country', e.target.value)}
				size='small'
				value={address?.country ?? ''}
			/>
			{onAddressSave && isAddressDirty && (
				<Button
					fullWidth
					isLoading={isAddressSaving}
					onClick={onAddressSave}
					variant='contained'
				>
					{t('availability.week.drawer.address-save')}
				</Button>
			)}
		</>
	);
};
