import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';

import type { IContactInfoItemProps } from './ContactInfoItem.types';

export const ContactInfoItem = ({ label, value }: IContactInfoItemProps) => {
	const { t } = useTranslation();

	if (!value) return null;

	return (
		<Box display='flex' alignItems='center' justifyContent='space-between'>
			<Typography variant='body1' fontWeight={500} pr={2}>
				{t(label)}:
			</Typography>
			<Typography variant='body1'>{value}</Typography>
		</Box>
	);
};
