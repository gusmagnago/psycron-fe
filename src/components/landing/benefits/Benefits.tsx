import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
  BenefitsBox,
  BenefitsItems,
  BenefitsSectionWrapper,
} from './Benefits.styles';
import { useTranslation } from 'react-i18next';

export const Benefits = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      key: 'increased-efficiency',
      img: '/images/img-clock.png',
      imgAlt: 'clock-icon',
      justify: 'end',
    },
    {
      key: 'better-patient-management',
      img: '/images/img-sort.png',
      imgAlt: 'sorting-box',
      justify: 'start',
    },
    {
      key: 'reduced-administrative-burden',
      img: '/images/img-hero4.png',
      imgAlt: 'img-heart-hands',
      justify: 'end',
    },
    {
      key: 'enhanced-financial-control',
      img: '/images/img-locker.png',
      imgAlt: 'locker-pig',
      justify: 'start',
    },
  ];

  return (
    <BenefitsSectionWrapper>
      <BenefitsBox>
        {benefits.map(({ key, img, imgAlt, justify }, index) => (
          <BenefitsItems
            key={`benefits-item-${index}`}
            justify={justify}
            id='benefits'
          >
            <Box m={5}>
              <img src={img} alt={imgAlt} width={150} />
            </Box>
            <Box
              display='flex'
              flexDirection='column'
              alignItems={`flex-${justify}`}
              width='100%'
            >
              <Text
                variant='subtitle1'
                fontWeight={700}
                fontSize={'1.8rem'}
                textAlign={justify.includes('end') ? 'right' : 'left'}
              >
                {t(`page.landing.benefits.${key}.name`)}
              </Text>
              <Text
                variant='body2'
                fontSize={'1rem'}
                textAlign={justify.includes('end') ? 'right' : 'left'}
              >
                {t(`page.landing.benefits.${key}.description`)}
              </Text>
            </Box>
          </BenefitsItems>
        ))}
      </BenefitsBox>
    </BenefitsSectionWrapper>
  );
};
