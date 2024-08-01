import { useEffect, useRef, useState } from 'react';
import { useAnimation } from 'framer-motion';

import { ITextAnimated } from './TextAnimated.types';
import { StyledMotionDiv, StyledMotionSpan } from './TextAnimated.styles';

export const TextAnimated = ({ text, children }: ITextAnimated) => {
  const controls = useAnimation();
  const [isInView, setIsInView] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const word = {
    hidden: { opacity: 0, y: '100%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: 'easeOut',
        duration: 0.5,
      },
    },
  };

  return (
    <StyledMotionDiv
      ref={textRef}
      initial='hidden'
      animate={controls}
      variants={sentence}
    >
      {text.split(' ').map((wordText, index) => (
        <StyledMotionSpan key={index} variants={word}>
          {children(wordText)}
        </StyledMotionSpan>
      ))}
    </StyledMotionDiv>
  );
};
