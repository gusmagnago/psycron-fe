import { styled } from '@mui/material';
import { isSmallerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

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
