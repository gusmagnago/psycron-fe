import { useTranslation } from 'react-i18next';

import type { ConflictMatch } from '../../hooks/useBookingForm';

import {
	ConflictBody,
	ConflictPatientName,
} from './SlotBookingConflictView.styles';

interface ISlotBookingConflictViewProps {
	conflict: ConflictMatch;
}

export const SlotBookingConflictView = ({
	conflict,
}: ISlotBookingConflictViewProps) => {
	const { t } = useTranslation();

	if (conflict.kind === 'multiple') {
		return (
			<ConflictBody
				id='availability-week-conflict-body'
				data-testid='availability-week-conflict-body'
			>
				{t('availability.week.drawer.conflict-multiple-body')}
			</ConflictBody>
		);
	}

	const fullName = `${conflict.patient.firstName} ${conflict.patient.lastName}`;

	return (
		<>
			<ConflictBody
				id='availability-week-conflict-body'
				data-testid='availability-week-conflict-body'
			>
				{t('availability.week.drawer.conflict-single-body')}
			</ConflictBody>
			<ConflictPatientName
				id='availability-week-conflict-patient-name'
				data-testid='availability-week-conflict-patient-name'
			>
				{fullName}
			</ConflictPatientName>
		</>
	);
};
