import { Box, Paper } from '@mui/material';

import { CardTitle } from '@psycron/components/card/CardTitle/CardTitle';

import { Divider } from '@psycron/components/divider/Divider';
import { Payment } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import {
  StyledBox,
  StyledInner,
  StyledInnerRound,
} from './PaymentsCard.styles';
import { CircularProgress } from '@psycron/components/progress/circular/CircularProgress';

export const PaymentsCard = () => {
  const data = [100, 0];

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
        <CircularProgress progress={data} />
      </Box>
    </Paper>
  );
};
