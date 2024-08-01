import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Avatar } from '@psycron/components/avatar/Avatar';
import { Button } from '@psycron/components/button/Button';
import { AddressForm } from '@psycron/components/form/components/address/AddressForm';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { NameForm } from '@psycron/components/form/components/name/NameForm';
import { PasswordInput } from '@psycron/components/form/components/password/PasswordInput';
import { Switch } from '@psycron/components/switch/components/item/Switch';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import {
	EditButton,
	EditingBox,
	EditUserButtonWrapper,
	EditUserFooter,
} from './EditUser.styles';

export const EditUser = () => {
	const { t } = useTranslation();
	const { section } = useParams<{ section: string }>();

	const [isEditName, setIsEditName] = useState<boolean>(false);
	const [isEditContacts, setIsEditContacts] = useState<boolean>(false);
	const [isEditAddress, setIsEditAddress] = useState<boolean>(false);
	const [isEditPassword, setIsEditPassword] = useState<boolean>(false);

	const navigate = useNavigate();

	const {
		register,
		getValues,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		setIsEditName(section === 'name');
		setIsEditContacts(section === 'contacts');
		setIsEditAddress(section === 'address');
		setIsEditPassword(section === 'password');
	}, [section]);

	const defaultMainDetails = {
		src: '',
		firstName: 'Johan',
		lastName: 'Donna',
		passwordHash: '************',
	};

	const defaultContacts = {
		defaultEmail: 'email@email.com',
		defaultPhone: '+552756161616',
		defaultWpp: '+372000000000000',
	};

	const defaultAddress = {
		address: '123 Main St, Apt 4B',
		administrativeArea: 'California',
		city: 'Los Angeles',
		country: 'USA',
		moreInfo: 'Near the big park',
		postalCode: '90001',
		route: 'Main St',
		streetNumber: '123',
		sublocality: 'Downtown',
	};

	return (
		<Box>
			<EditingBox isEditing={isEditName}>
				<Box display='flex' alignItems='center'>
					<Avatar
						firstName={defaultMainDetails.firstName}
						lastName={defaultMainDetails.lastName}
						src={defaultMainDetails.src}
						large
					/>
					<NameForm
						errors={errors}
						register={register}
						placeholderFirstName={defaultMainDetails.firstName}
						placeholderLastName={defaultMainDetails.lastName}
						disabled={!isEditName}
					/>
				</Box>
				<EditButton>
					<Switch
						label={t('components.user-details.edit')}
						defaultChecked={isEditName}
						onChange={() => setIsEditName((prev) => !prev)}
					/>
				</EditButton>
			</EditingBox>
			<EditingBox isEditing={isEditPassword}>
				<PasswordInput
					errors={errors}
					register={register}
					hasToConfirm={isEditPassword}
					defaultPasswordHash={defaultMainDetails.passwordHash}
					disabled={!isEditPassword}
				/>
				<EditButton>
					<Switch
						label={t('components.user-details.change', {
							name: t('globals.password'),
						})}
						defaultChecked={isEditPassword}
						onChange={() => setIsEditPassword((prev) => !prev)}
					/>
				</EditButton>
			</EditingBox>
			<Box mb={spacing.xxl}>
				<EditingBox isEditing={isEditContacts}>
					<ContactsForm
						errors={errors}
						register={register}
						getPhoneValue={getValues}
						setPhoneValue={setValue}
						defaultValues={defaultContacts}
						disabled={!isEditContacts}
					/>
					<EditButton>
						<Switch
							label={t('components.user-details.edit-contacts')}
							defaultChecked={isEditContacts}
							onChange={() => setIsEditContacts((prev) => !prev)}
						/>
					</EditButton>
				</EditingBox>
				<EditingBox isEditing={isEditAddress}>
					<AddressForm
						errors={errors}
						register={register}
						defaultValues={defaultAddress}
						disabled={!isEditAddress}
					/>
					<EditButton>
						<Switch
							label={t('components.user-details.change', {
								name: t('globals.address'),
							})}
							defaultChecked={isEditAddress}
							onChange={() => setIsEditAddress((prev) => !prev)}
						/>
					</EditButton>
				</EditingBox>
			</Box>
			<EditUserFooter component='footer' zIndex={100}>
				<EditUserButtonWrapper>
					<Button>{t('components.user-details.save')}</Button>
					<Button secondary onClick={() => navigate(-1)}>
						{t('globals.cancel')}
					</Button>
				</EditUserButtonWrapper>
			</EditUserFooter>
		</Box>
	);
};
