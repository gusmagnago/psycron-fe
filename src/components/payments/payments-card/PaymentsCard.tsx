import { Box, Paper } from '@mui/material';
import { CardTitle } from '@psycron/components/card/CardTitle/CardTitle';
import { Divider } from '@psycron/components/divider/Divider';
import { Payment } from '@psycron/components/icons';
import { CircularProgress } from '@psycron/components/progress/circular/CircularProgress';
import { palette } from '@psycron/theme/palette/palette.theme';

import {
	StyledBox,
	StyledInner,
	StyledInnerRound,
} from './PaymentsCard.styles';

export const PaymentsCard = () => {
	// progress should come from a context provider with the values from the therapist user
	const mockProgressData = 70;

	return (
		<Paper>
			<CardTitle
				title={'Payments'}
				hasFirstChip
				firstChip={() => alert('First Chip clicked')}
				firstChipName={<Payment color={palette.tertiary.main} />}
				firstChipTooltip='manage payments'
			/>
			<Divider />
			<Box p={5} display='flex' justifyContent='center' alignItems='center'>
				<StyledBox>
					<StyledInner>
						<StyledInnerRound />
					</StyledInner>
				</StyledBox>
				<CircularProgress
					progress={[mockProgressData, 100 - mockProgressData]}
				/>
			</Box>
		</Paper>
	);
};
