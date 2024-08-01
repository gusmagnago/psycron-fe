import { motion } from 'framer-motion';

import { styled } from '@mui/material';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { isSmallerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';

export const StyledMotionDiv = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  margin-top: ${spacing.small};

  ${isSmallerThanMediumMedia} {
    padding: ${spacing.mediumLarge};
  }
`;

export const StyledMotionSpan = styled(motion.span)`
  display: inline-block;
  margin-right: ${spacing.xs};
`;
