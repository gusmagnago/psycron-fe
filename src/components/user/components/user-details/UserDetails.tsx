import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { Avatar } from '@psycron/components/avatar/Avatar';
import {
	Address,
	EditUser,
	Password,
	PatientList,
	Phone,
	Plan,
	PlanPaid,
	PlanUnpaid,
} from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { useUserDetails } from '@psycron/context/user/UserDetailsContext';
import useClickOutside from '@psycron/hooks/useClickoutside';
import useViewport from '@psycron/hooks/useViewport';

import { AddressInfoItem } from '../address-info-item/AddressInfoItem';
import { ContactInfoItem } from '../contact-info-item/ContactInfoItem';
import type { IUserDetailsCardProps } from '../user-details-card/UserDetailsCard.types';

import {
	Item,
	ItemWrapper,
	NameEmailBox,
	StyledUserDetailsLinks,
	UserDetailsItems,
	UserDetailsItemWrapper,
	UserDetailsTop,
} from './UserDetails.styles';

export const UserDetails = ({ plan, user }: IUserDetailsCardProps) => {
	const userDetailsCardRef = useRef<HTMLDivElement | null>(null);
	const [isEditUser, setIsEditUser] = useState<boolean>(false);

	const { t } = useTranslation();

	const { toggleUserDetails, handleClickEditUser } = useUserDetails();
	const { isMobile, isTablet } = useViewport();

	const { name: planName, status: planStatus } = plan;
	const {
		contacts: { address, phone, whatsapp },
		firstName,
		lastName,
		patients,
		pass,
		email,
		image,
	} = user;

	useClickOutside(userDetailsCardRef, toggleUserDetails);

	const planStatusInfo = (
		<Box display='flex'>
			<Typography px={2}>{planName}</Typography>
			{planStatus === 'paid' ? <PlanPaid /> : <PlanUnpaid />}
		</Box>
	);

	const addressDetails = [
		{ value: `${address.route} ${address.streetNumber}` },
		{ value: address.moreInfo },
		{ value: `${address.sublocality} ${address.city}` },
		{ value: `${address.administrativeArea} ${address.postalCode}` },
		{ value: address.country },
	];

	const addressInfo = (
		<Box display='flex' flexDirection='column' alignItems='flex-end'>
			{addressDetails.map((detail, index) => (
				<AddressInfoItem key={index} value={detail.value} />
			))}
		</Box>
	);

	const contactDetails = [
		{ label: 'globals.phone', value: phone },
		{ label: 'globals.whatsapp', value: whatsapp },
		{ label: 'globals.email', value: email },
	];

	const constactsInfo = (
		<Box>
			{contactDetails.map((detail, index) => (
				<ContactInfoItem
					key={index}
					label={detail.label}
					value={detail.value}
				/>
			))}
		</Box>
	);

	const userDetailsCardItems = [
		{
			name: t('globals.password'),
			icon: <Password />,
			value: <Typography variant='body1'>{pass}</Typography>,
			edit: t('components.user-details.change', {
				name: t('globals.password'),
			}),
			subPath: '/password',
		},
		{
			name: 'Contacts',
			icon: <Phone />,
			value: constactsInfo,
			edit: t('components.user-details.edit-contacts'),
			subPath: '/contacts',
		},
		{
			name: t('globals.address'),
			icon: <Address />,
			value: addressInfo,
			edit: t('components.user-details.change', { name: t('globals.address') }),
			subPath: '/address',
		},
		{
			name: t('globals.plan'),
			icon: <Plan />,
			value: planStatusInfo,
			sub: t('globals.subscription-manager'),
			subPath: '/subscription',
		},
		{
			name: t('globals.registered-patients'),
			icon: <PatientList />,
			value: patients.length,
			sub: t('globals.patients-manager'),
			subPath: '/patients',
		},
	];

	return (
		<>
			<Box>
				<UserDetailsTop>
					<Box display='flex'>
						<Avatar
							src={image}
							large
							firstName={firstName}
							lastName={lastName}
						/>
						<Box display='flex' flexDirection='column'>
							<NameEmailBox>
								<Typography
									variant='subtitle1'
									fontWeight={600}
								>{`${firstName} ${lastName}`}</Typography>
								<Typography variant='overline'>{email}</Typography>
							</NameEmailBox>
							<StyledUserDetailsLinks
								onClick={() => handleClickEditUser('/name')}
							>
								<Typography variant='caption'>
									{isEditUser ? t('components.user-details.edit') : null}
								</Typography>
							</StyledUserDetailsLinks>
						</Box>
					</Box>
					<Box onClick={() => setIsEditUser((prev) => !prev)}>
						<Tooltip
							title={t('components.user-details.edit')}
							placement={isMobile || isTablet ? 'left' : 'right'}
						>
							<EditUser />
						</Tooltip>
					</Box>
				</UserDetailsTop>
				<UserDetailsItems>
					{userDetailsCardItems.map(
						({ name, icon, value, sub, subPath, edit }, index) => (
							<UserDetailsItemWrapper key={`item-${name}-${index}`}>
								<ItemWrapper>
									<Box height={40}>{icon}</Box>
									<Item>
										<Typography
											variant='subtitle1'
											fontWeight={600}
											textTransform='capitalize'
										>
											{name}
										</Typography>
										<StyledUserDetailsLinks
											onClick={() => handleClickEditUser(subPath)}
										>
											<Typography variant='caption'>
												{isEditUser && edit?.length ? edit : sub}
											</Typography>
										</StyledUserDetailsLinks>
									</Item>
								</ItemWrapper>
								<Box>{value}</Box>
							</UserDetailsItemWrapper>
						)
					)}
				</UserDetailsItems>
			</Box>
		</>
	);
};
