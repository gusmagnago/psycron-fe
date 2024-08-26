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
import type {
	IAddress,
	IBaseUser,
	IContactInfo,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import {
	EditButton,
	EditingBox,
	EditUserButtonWrapper,
	EditUserFooter,
	EditUserWrapper,
} from './EditUser.styles';

export const EditUser = () => {
	const { t } = useTranslation();
	const { userId } = useParams<{ userId: string }>();

	const { userDetails } = useUserDetails(userId);

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

	const getUserDetails = (userDetails?: Partial<IBaseUser>) => {
		return {
			src: '',
			firstName: userDetails?.firstName,
			lastName: userDetails?.lastName,
			passwordHash: '************',
		};
	};

	const defaultMainDetails = getUserDetails(userDetails);

	const getContacts = (userDetails?: { contacts: IContactInfo }) => {
		return {
			email: userDetails?.contacts.email,
			phone: userDetails?.contacts?.phone || '',
			whatsapp: userDetails?.contacts?.whatsapp || '',
		};
	};

	const defaultContacts = getContacts(userDetails);

	const getAddress = (userDetails?: { address?: IAddress }) => {
		return {
			address: `${userDetails?.address?.streetNumber ?? ''}, ${userDetails?.address?.route ?? ''}`,
			streetNumber: userDetails?.address?.streetNumber || '',
			route: userDetails?.address?.route || '',
			administrativeArea: userDetails?.address?.administrativeArea || '',
			city: userDetails?.address?.city || '',
			country: userDetails?.address?.country || '',
			moreInfo: userDetails?.address?.moreInfo || '',
			postalCode: userDetails?.address?.postalCode || '',
			sublocality: userDetails?.address?.sublocality || '',
		};
	};

	const defaultAddress = getAddress(userDetails);

	return (
		<Box width={'100%'} display='flex' justifyContent='center'>
			<EditUserWrapper>
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
			</EditUserWrapper>
		</Box>
	);
};
