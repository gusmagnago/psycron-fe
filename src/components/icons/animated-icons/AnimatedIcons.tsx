import { FC, useEffect, useState } from 'react';
import { WithIconColorProps } from '@psycron/hoc/withIconColor';

import { IAnimatedIconsProps } from './AnimatedIcons.types';
import { StyledAnimatedIconsWrapper } from './AnimatedIcons.styles';
import { animate, useAnimation, useMotionValue } from 'framer-motion';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = array.slice();
  let currentIndex = shuffled.length;
  let temporaryValue: T, randomIndex: number;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }
  return shuffled;
};

export const AnimatedIcons = ({ icons, colors }: IAnimatedIconsProps) => {
  const [iconIndex, setIconIndex] = useState<number>(0);
  const [shuffledIcons, setShuffledIcons] = useState<FC<WithIconColorProps>[]>(
    []
  );
  const [shuffledColors, setShuffledColors] = useState<(string | undefined)[]>(
    []
  );

  const progress = useMotionValue<number>(iconIndex);
  const controls = useAnimation();

  useEffect(() => {
    setShuffledIcons(shuffleArray(icons));
    setShuffledColors(shuffleArray(colors));
  }, [icons, colors]);

  useEffect(() => {
    const interval = setInterval(() => {
      animate(progress, iconIndex + 1, {
        duration: 0.2,
        ease: 'easeInOut',
        onComplete: () => {
          if (iconIndex === shuffledIcons.length - 1) {
            progress.set(0);
            setIconIndex(0);
            setShuffledIcons(shuffleArray(icons));
            setShuffledColors(shuffleArray(colors));
          } else {
            setIconIndex(iconIndex + 1);
          }
        },
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [iconIndex, shuffledIcons, icons, colors]);

  const IconComponent = shuffledIcons[iconIndex % shuffledIcons.length];

  return (
    <StyledAnimatedIconsWrapper animate={controls}>
      {IconComponent && (
        <IconComponent
          color={shuffledColors[iconIndex % shuffledColors.length]}
        />
      )}
    </StyledAnimatedIconsWrapper>
  );
};
