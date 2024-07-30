import { Box } from '@mui/material';
import { Brand } from '../icons';

import { Link } from '../link/Link';

export const Header = () => {
  return (
    <Box
      p={5}
      display='flex'
      alignItems='center'
      justifyContent='space-between'
    >
      <Box height={'50px'} width={'150px'}>
        <Brand />
      </Box>
      <Box>
        <Link to='' isHeader>
          About
        </Link>
        <Link to='' isHeader>
          Pricing
        </Link>
      </Box>
    </Box>
  );
};
