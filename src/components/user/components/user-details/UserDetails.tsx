import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Typography } from '@mui/material';
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
import { Link } from '@psycron/components/link/Link';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { useUserDetails } from '@psycron/context/user/UserDetailsContext';
import useClickOutside from '@psycron/hooks/useClickoutside';

import type { IUserDetailsCardProps } from '../user-details-card/UserDetailsCard.types';

import { AddressItem, ItemIcon, ItemLinkWrapper, NameEmailBox, UserDetailsItems, UserDetailsItemWrapper, UserDetailsTop } from './UserDetails.styles';

export const UserDetails = ({ plan, user }: IUserDetailsCardProps) => {
	const userDetailsCardRef = useRef<HTMLDivElement | null>(null);
	const { t } = useTranslation();
	const { toggleUserDetails } = useUserDetails();

	const { name: planName, status: planStatus } = plan;
	const {
		contacts: { address, phone },
		firstName,
		lastName,
		patients,
		pass,
		email,
		image,
	} = user;

	useClickOutside(userDetailsCardRef, toggleUserDetails);

	const stringToColor = (string: string) => {
		let hash = 0;
		let i;

		/* eslint-disable no-bitwise */
		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';
		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */
		return color;
	};

	const stringAvatar = (name: string) => {
		return {
			sx: {
				bgcolor: stringToColor(name),
				width: 56,
				height: 56,
			},
			children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
		};
	};

	const planStatusInfo = (
		<Box display='flex'>
			<Typography px={2}>{planName}</Typography>
			{planStatus === 'paid' ? <PlanPaid /> : <PlanUnpaid />}
		</Box>
	);

	const addressInfo = (
		<Box display='flex' flexDirection='column' alignItems='flex-end'>
			<AddressItem variant='body1'>{`${address.route} ${address.streetNumber}`}</AddressItem>
			{address.moreInfo ? (
				<AddressItem variant='body1'>{address.moreInfo}</AddressItem>
			) : null}
			<AddressItem variant='body1'>{`${address.sublocality} ${address.city}`}</AddressItem>
			<AddressItem variant='body1'>{`${address.administrativeArea} ${address.postalCode}`}</AddressItem>
			<AddressItem variant='body1'>{address.country}</AddressItem>
		</Box>
	);

	const userDetailsCardItems = [
		{
			name: t('globals.password'),
			icon: <Password />,
			value: <Typography variant='body1'>{pass}</Typography>,
		},
		{
			name: t('globals.phone'),
			icon: <Phone />,
			value: <Typography variant='body1'>{phone}</Typography>,
		},
		{ name: t('globals.address'), icon: <Address />, value: addressInfo },
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
							alt={`user-${firstName}-avatar`}
							src={image! == undefined ? image : ''}
							{...stringAvatar(`${firstName} ${lastName}`)}
						/>
						<NameEmailBox>
							<Typography
								variant='subtitle1'
								fontWeight={600}
							>{`${firstName} ${lastName}`}</Typography>
							<Typography variant='overline'>{email}</Typography>
						</NameEmailBox>
					</Box>
					<Box>
						<Tooltip title={t('components.user-details.edit')} placement='left'>
							<EditUser />
						</Tooltip>
					</Box>
				</UserDetailsTop>
				<UserDetailsItems>
					{userDetailsCardItems.map(
						({ name, icon, value, sub, subPath }, index) => (
							<UserDetailsItemWrapper key={`item-${name}-${index}`}>
								<ItemIcon>
									<Box>{icon}</Box>
									<ItemLinkWrapper
										display='flex'
										flexDirection='column'
										alignItems='flex-start'
									>
										<Typography
											variant='subtitle1'
											fontWeight={600}
											textTransform='capitalize'
										>
											{name}
										</Typography>
										<>
											{sub ? (
												<Link to={subPath} firstLetterUpper>
													<Typography variant='caption'>{sub}</Typography>
												</Link>
											) : null}
										</>
									</ItemLinkWrapper>
								</ItemIcon>
								<Box>{value}</Box>
							</UserDetailsItemWrapper>
						)
					)}
				</UserDetailsItems>
			</Box>
		</>
	);
};
