import { useRef } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  BenefitsItems,
  StyledAnimatedBox,
  StyledDescription,
  StyledImgWrapper,
  StyledTitle,
} from './BenefitsItem.styles';
import { IParallaxBenefitItemProps } from './BenefitsItem.types';

export const ParallaxBenefitItem = ({
  img,
  imgAlt,
  justify,
  i18Nkey,
}: IParallaxBenefitItemProps) => {
  const { t } = useTranslation();

  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({ target: imgWrapperRef });

  const useParallax = (value: MotionValue<number>, distance: number) => {
    return useTransform(value, [0, 1], [-distance, distance]);
  };

  const imgWrapperY = useParallax(scrollYProgress, 50);

  const titleY = useParallax(scrollYProgress, 30);

  const textY = useParallax(scrollYProgress, 30);

  return (
    <BenefitsItems justify={justify} id='benefits'>
      <StyledAnimatedBox ref={imgWrapperRef} style={{ y: imgWrapperY }}>
        <StyledImgWrapper>
          <img src={img} alt={imgAlt} width={'auto'} height={'100%'} />
        </StyledImgWrapper>
      </StyledAnimatedBox>
      <Box
        display='flex'
        flexDirection='column'
        alignItems={`flex-${justify}`}
        width='100%'
      >
        <motion.div ref={titleRef} style={{ y: titleY }}>
          <StyledTitle
            variant='subtitle1'
            justify={justify}
            textAlign={justify.includes('end') ? 'right' : 'left'}
          >
            {t(`page.landing.benefits.${i18Nkey}.name`)}
          </StyledTitle>
        </motion.div>
        <motion.div ref={textRef} style={{ y: textY }}>
          <StyledDescription
            variant='body2'
            textAlign={justify.includes('end') ? 'right' : 'left'}
          >
            {t(`page.landing.benefits.${i18Nkey}.description`)}
          </StyledDescription>
        </motion.div>
      </Box>
    </BenefitsItems>
  );
};
