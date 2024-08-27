import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import type { CustomError } from '@psycron/api/error';
import { editUserById, type IEditUser } from '@psycron/api/user';
import { Avatar } from '@psycron/components/avatar/Avatar';
import { Button } from '@psycron/components/button/Button';
import { AddressForm } from '@psycron/components/form/components/address/AddressForm';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { NameForm } from '@psycron/components/form/components/name/NameForm';
import { PasswordInput } from '@psycron/components/form/components/password/PasswordInput';
import { Loader } from '@psycron/components/loader/Loader';
import { Switch } from '@psycron/components/switch/components/item/Switch';
import { useAlert } from '@psycron/context/alert/AlertContext';
import type { IAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { useMutation } from '@tanstack/react-query';

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
	const { session } = useParams<{ session: string }>();

	const navigate = useNavigate();

	const { userDetails, isUserDetailsSucces, isUserDetailsLoading } =
		useUserDetails(userId);

	const [isEditName, setIsEditName] = useState<boolean>(false);

	const [isEditContacts, setIsEditContacts] = useState<boolean>(false);
	const [isEditAddress, setIsEditAddress] = useState<boolean>(false);
	const [isEditPassword, setIsEditPassword] = useState<boolean>(false);

	const { showAlert } = useAlert();

	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		setIsEditName(session === 'name');
		setIsEditContacts(session === 'contacts');
		setIsEditAddress(session === 'address');
		setIsEditPassword(session === 'password');
	}, [session]);

	const editUserMutation = useMutation({
		mutationFn: (editData: IEditUser) => editUserById(editData),
		onSuccess: () => {
			showAlert({
				message: 'Details edited successfully',
				severity: 'success',
			});

			setIsEditName(false);
			setIsEditContacts(false);
			setIsEditAddress(false);
			setIsEditPassword(false);

			navigate(-1);
		},
		onError: (error: CustomError) => {
			showAlert({
				message: error.message || 'something went wrong',
				severity: 'error',
			});
		},
	});

	if (isUserDetailsLoading || !isUserDetailsSucces) {
		return <Loader />;
	}

	const handleSave = () => {
		const data = getValues();

		const editData: IEditUser = {
			userId: userDetails._id,
			data: {
				firstName: data.firstName || userDetails.firstName,
				lastName: data.lastName || userDetails.lastName,
				contacts: {
					email: data.email || userDetails.contacts.email,
					phone: data.countryCode + data.phone || userDetails.contacts.phone,
					whatsapp: data.whatsapp || userDetails.contacts.whatsapp,
				},
				address: {
					administrativeArea:
						data.administrativeArea || userDetails.address?.administrativeArea,
					city: data.city || userDetails.address?.city,
					country: data.country || userDetails.address?.country,
					streetNumber: data.streetNumber || userDetails.address?.streetNumber,
					route: data.route || userDetails.address?.route,
					postalCode: data.postalCode || userDetails.address?.postalCode,
					sublocality: data.sublocality || userDetails.address?.sublocality,
				},
			},
		};

		const addressFields = [
			'administrativeArea',
			'city',
			'country',
			'streetNumber',
			'route',
			'postalCode',
			'sublocality',
		];

		const isAddressEmpty = addressFields.every(
			(field) => !editData.data.address?.[field as keyof IAddress]
		);

		if (isAddressEmpty) {
			delete editData.data.address;
		}

		editUserMutation.mutate(editData);
	};

	return (
		<Box width='100%' display='flex' justifyContent='center'>
			<EditUserWrapper as='form' onSubmit={handleSubmit(handleSave)}>
				<EditingBox isEditing={isEditName}>
					<Box display='flex' alignItems='center'>
						<Avatar
							firstName={userDetails?.firstName}
							lastName={userDetails?.lastName}
							src={''}
							large
						/>
						<NameForm
							errors={errors}
							register={register}
							placeholderFirstName={userDetails?.firstName}
							placeholderLastName={userDetails?.lastName}
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
						defaultPasswordHash='************'
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
							defaultValues={userDetails?.contacts}
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
							defaultValues={userDetails?.address}
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

				<EditUserFooter component='footer' zIndex={10}>
					<EditUserButtonWrapper>
						<Button type='submit'>{t('components.user-details.save')}</Button>
						<Button secondary onClick={() => navigate(-1)}>
							{t('globals.cancel')}
						</Button>
					</EditUserButtonWrapper>
				</EditUserFooter>
			</EditUserWrapper>
		</Box>
	);
};
