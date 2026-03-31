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
			<ConflictBody>
				{t('availability.week.drawer.conflict-multiple-body')}
			</ConflictBody>
		);
	}

	const fullName = `${conflict.patient.firstName} ${conflict.patient.lastName}`;

	return (
		<>
			<ConflictBody>
				{t('availability.week.drawer.conflict-single-body')}
			</ConflictBody>
			<ConflictPatientName>{fullName}</ConflictPatientName>
		</>
	);
};
