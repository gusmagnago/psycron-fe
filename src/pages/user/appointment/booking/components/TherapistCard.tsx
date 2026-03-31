import { Avatar } from '@psycron/components/avatar/Avatar';
import { Text } from '@psycron/components/text/Text';
import type { ITherapist } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import {
	CardWrapper,
	InfoBlock,
	SpecialityChip,
	SpecialityRow,
} from './TherapistCard.styles';

interface ITherapistCardProps {
	therapist: Pick<
		ITherapist,
		'firstName' | 'lastName' | 'picture' | 'specialities'
	>;
}

export const TherapistCard = ({ therapist }: ITherapistCardProps) => {
	const { firstName, lastName, picture, specialities } = therapist;
	const visibleSpecialities = (specialities ?? []).slice(0, 3);

	return (
		<CardWrapper>
			<Avatar firstName={firstName} lastName={lastName} src={picture} />
			<InfoBlock>
				<Text fontWeight={600} variant='subtitle1'>
					{firstName} {lastName}
				</Text>
				{visibleSpecialities.length > 0 && (
					<SpecialityRow>
						{visibleSpecialities.map((s) => (
							<SpecialityChip key={s}>{s}</SpecialityChip>
						))}
					</SpecialityRow>
				)}
			</InfoBlock>
		</CardWrapper>
	);
};
