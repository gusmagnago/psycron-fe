import { motion } from 'framer-motion';
import { styled } from '@mui/material';

export const StyledAnimatedIconsWrapper = styled(motion.div)`
  width: auto;
  height: 100%;

  & svg {
    width: 100%;
    height: 100%;
  }
`;
