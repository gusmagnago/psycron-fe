import { Box } from '@mui/material';
import { Link } from '@psycron/components/link/Link';
import { Text } from '@psycron/components/text/Text';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { IEmptyStateProps } from './EmptyState.types';

export const EmptyState = ({
	ariaLabel,
	img,
	isAppointment,
	today,
}: IEmptyStateProps) => {
	return (
		<Box p={spacing.small} display='flex'>
			<Box display='flex' alignItems='center'>
				<Box>
					<Text variant='h6' isFirstUpper mb={2}>
						{`You don't have any ${isAppointment ? 'appointments' : 'patients'} ${today ? 'for today' : 'yet'}.`}
					</Text>
					<Text isFirstUpper>
            please,
						<Link to={isAppointment ? '/appointments/create' : '/patients/add'}>
              click here
						</Link>
            to{' '}
						{isAppointment
							? 'share your availability and create appointments'
							: 'add patients'}
            .
					</Text>
				</Box>
				<img
					aria-label={`empty-${ariaLabel}`}
					src={img}
					width='100%'
					height='auto'
				/>
			</Box>
		</Box>
	);
};
