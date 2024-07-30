import { Box } from '@mui/material';
import { H2, H6, Heading, HeroWrapper, Image } from './Hero.styles';

import { IHero } from './Hero.types';

export const Hero = ({ headingText, imgSrc, helperText, c2Action }: IHero) => {
  return (
    <HeroWrapper>
      <Heading>
        <H2 variant='h1'>{headingText}</H2>
        <Image src={imgSrc} loading='lazy' />
      </Heading>
      <Box my={5}>
        <H6 variant='h6'>{helperText}</H6>
      </Box>
      {c2Action}
    </HeroWrapper>
  );
};
