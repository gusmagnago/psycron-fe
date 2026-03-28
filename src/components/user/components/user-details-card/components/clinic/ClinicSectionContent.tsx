import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { Address } from '@psycron/components/icons';

import { UserDetailsRow } from '../account/components/UserDetailsRow';

import {
	ClinicContainer,
	ClinicEmptyIcon,
	ClinicEmptyState,
	ClinicEmptyTitle,
	ClinicValueText,
} from './ClinicSectionContent.styles';
import type { ClinicSectionContentProps } from './ClinicSectionContent.types';

const IN_PERSON_TYPES = new Set(['IN_PERSON', 'BOTH']);

export const ClinicSectionContent = ({
	clinicAddress,
	sessionType,
	onEditAddress,
}: ClinicSectionContentProps) => {
	const { t } = useTranslation();

	const requiresAddress = sessionType ? IN_PERSON_TYPES.has(sessionType) : false;

	if (!clinicAddress?.street) {
		if (!requiresAddress) return null;

		return (
			<ClinicContainer>
				<ClinicEmptyState>
					<ClinicEmptyIcon>
						<Address />
					</ClinicEmptyIcon>
					<ClinicEmptyTitle>
						{t('components.user-details.section.clinic.title-empty')}
					</ClinicEmptyTitle>
					<Button type='button' onClick={onEditAddress}>
						{t('components.user-details.section.clinic.add-address')}
					</Button>
				</ClinicEmptyState>
			</ClinicContainer>
		);
	}

	const addressLines = [
		clinicAddress.street,
		clinicAddress.city,
		clinicAddress.postcode,
		clinicAddress.country,
	].filter(Boolean);

	return (
		<ClinicContainer>
			<UserDetailsRow
				label={t('components.user-details.section.clinic.address-label')}
				value={
					<ClinicValueText>
						{addressLines.join(', ')}
					</ClinicValueText>
				}
				right={
					<Button type='button' tertiary variant='outlined' onClick={onEditAddress}>
						{t('components.user-details.section.clinic.edit-address')}
					</Button>
				}
			/>
		</ClinicContainer>
	);
};
