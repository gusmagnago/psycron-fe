import { useTranslation } from 'react-i18next';
import type { IPatientConflictCandidate } from '@psycron/api/user/availability/index.types';

import type { ConflictMatch } from '../../hooks/useBookingForm';

import {
	ConflictActionButton,
	ConflictActions,
	ConflictBody,
	ConflictPatientName,
	ConflictTitle,
	ConflictWrapper,
} from './SlotBookingConflictView.styles';

interface ISlotBookingConflictViewProps {
	conflict: ConflictMatch;
	onConfirm: (patientId: string) => void;
	onDismiss: () => void;
}

const SingleConflict = ({
	onConfirm,
	onDismiss,
	patient,
}: {
	onConfirm: (id: string) => void;
	onDismiss: () => void;
	patient: IPatientConflictCandidate;
}) => {
	const { t } = useTranslation();
	const fullName = `${patient.firstName} ${patient.lastName}`;

	return (
		<>
			<ConflictBody>
				{t('availability.week.drawer.conflict-single-body')}
			</ConflictBody>
			<ConflictPatientName>{fullName}</ConflictPatientName>
			<ConflictActions>
				<ConflictActionButton
					tertiary
					variant='contained'
					onClick={() => onConfirm(patient._id)}
				>
					{t('availability.week.drawer.conflict-confirm', { name: patient.firstName })}
				</ConflictActionButton>
				<ConflictActionButton tertiary variant='outlined' onClick={onDismiss}>
					{t('availability.week.drawer.conflict-change-details')}
				</ConflictActionButton>
			</ConflictActions>
		</>
	);
};

const MultipleConflict = ({ onDismiss }: { onDismiss: () => void }) => {
	const { t } = useTranslation();

	return (
		<>
			<ConflictBody>
				{t('availability.week.drawer.conflict-multiple-body')}
			</ConflictBody>
			<ConflictActions>
				<ConflictActionButton tertiary variant='outlined' onClick={onDismiss}>
					{t('availability.week.drawer.conflict-change-details')}
				</ConflictActionButton>
			</ConflictActions>
		</>
	);
};

export const SlotBookingConflictView = ({
	conflict,
	onConfirm,
	onDismiss,
}: ISlotBookingConflictViewProps) => {
	const { t } = useTranslation();

	return (
		<ConflictWrapper>
			<ConflictTitle>
				{t('availability.week.drawer.conflict-title')}
			</ConflictTitle>
			{conflict.kind === 'single' ? (
				<SingleConflict
					onConfirm={onConfirm}
					onDismiss={onDismiss}
					patient={conflict.patient}
				/>
			) : (
				<MultipleConflict onDismiss={onDismiss} />
			)}
		</ConflictWrapper>
	);
};
