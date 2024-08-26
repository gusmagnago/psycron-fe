import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';

import type { IContactInfoItemProps } from './ContactInfoItem.types';

export const ContactInfoItem = ({ label, value }: IContactInfoItemProps) => {
	const { t } = useTranslation();

	const valueString =
		value != null
			? value
			: t('components.user-details.detail-not-found', { detail: t(label) });

	return (
		<Box display='flex' alignItems='center' justifyContent='space-between'>
			<Typography variant='body1' fontWeight={500} pr={2} textAlign='end'>
				{t(label)}:
			</Typography>
			<Typography
				variant='body2'
				color={value != null ? palette.text.primary : palette.text.disabled}
			>
				{valueString}
			</Typography>
		</Box>
	);
};
